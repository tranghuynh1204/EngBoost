import { Injectable } from '@nestjs/common';
import { CreateUserExamDto } from './dto/create-user-exam.dto';

import { InjectModel } from '@nestjs/mongoose';
import { UserExam, UserExamDocument } from './entities/user-exam.entity';
import { Model, Types } from 'mongoose';
import { SectionService } from 'src/section/section.service';

@Injectable()
export class UserExamService {
  constructor(
    private readonly sectionService: SectionService,
    @InjectModel(UserExam.name) private userExamModel: Model<UserExamDocument>,
  ) {}

  async create(createUserExamDto: CreateUserExamDto, userId: string) {
    const objectIds = createUserExamDto.sections.map(
      (id) => new Types.ObjectId(id),
    );
    const sections = await this.sectionService.findByIds(objectIds);
    const answersMap: Map<string, string> = new Map(
      Object.entries(createUserExamDto.answers),
    );

    const mapSectionCategory = new Map<
      string,
      { correct: number; questionCount: number }
    >();
    let correct = 0,
      questionCount = 0;
    for (const section of sections) {
      if (!mapSectionCategory.has(section.category)) {
        mapSectionCategory.set(section.category, {
          correct: 0,
          questionCount: 0,
        });
      }
      const categoryData = mapSectionCategory.get(section.category)!;
      for (const group of section.groups) {
        for (const question of group.questions) {
          categoryData.questionCount++;
          questionCount++;
          if (
            question.correctAnswer ===
            answersMap.get(question.serial.toString())
          ) {
            categoryData.correct++;
            correct++;
          }
        }
      }
    }
    const newUserExam = new this.userExamModel({
      ...createUserExamDto,
      sections: objectIds,
      exam: new Types.ObjectId(createUserExamDto.exam),
      user: userId,
      result: correct + '/' + questionCount,
      mapSectionCategory,
    });
    return newUserExam.save();
  }

  async findOne(id: string, userId: string): Promise<UserExam> {
    return await this.userExamModel
      .findOne({ _id: new Types.ObjectId(id), user: userId })
      .populate('sections')
      .populate('exam', 'title')
      .exec();
  }

  async getUniqueUserCountForExam(examId: string): Promise<number> {
    const uniqueUsers = await this.userExamModel
      .distinct('user', { exam: new Types.ObjectId(examId) })
      .exec();
    return uniqueUsers.length;
  }

  async findAllByExamAndUser(
    examId: string,
    userId: string,
  ): Promise<UserExam[]> {
    return await this.userExamModel
      .find({ exam: new Types.ObjectId(examId), user: userId })
      .select('startTime duration result')
      .exec();
  }

  async getNew(userId: string) {
    const results = await this.userExamModel
      .find({ user: userId })
      .select('startTime duration result sections') // Lấy thêm sections từ userExam
      .populate({
        path: 'exam',
        select: 'title sections id', // Lấy title và sections từ exam
        populate: {
          path: 'sections', // Populate sections của exam
        },
      })
      .populate({
        path: 'sections', // Populate sections của userExam
        select: 'name', // Chỉ lấy trường name
      })
      .sort({ startTime: -1 }) // Sắp xếp theo startTime giảm dần
      .limit(4)
      .lean()
      .exec();

    return results.map((userExam) => ({
      startTime: userExam.startTime,
      duration: userExam.duration,
      result: userExam.result,
      _id: userExam._id,
      sections:
        userExam.exam.sections?.length === userExam.sections?.length
          ? 'full test'
          : userExam.sections,
      exam: (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sections, ...rest } = userExam.exam; // Loại bỏ sections khỏi exam
        return rest; // Trả về exam mà không có sections
      })(),
    }));
  }

  async getHistory(currentPage: number, pageSize: number, userId: string) {
    const totalUserExams = await this.userExamModel
      .countDocuments({ user: userId })
      .exec();

    const totalPages = Math.ceil(totalUserExams / pageSize);

    const results = await this.userExamModel
      .find({ user: userId })
      .select('startTime duration result sections') // Lấy thêm sections từ userExam
      .populate({
        path: 'exam',
        select: 'title sections id', // Lấy title và sections từ exam
        populate: {
          path: 'sections', // Populate sections của exam
        },
      })
      .populate({
        path: 'sections', // Populate sections của userExam
        select: 'name', // Chỉ lấy trường name
      })
      .sort({ startTime: -1 }) // Sắp xếp theo startTime giảm dần
      .skip((currentPage - 1) * pageSize) // Phân trang
      .limit(pageSize)
      .lean()
      .exec();

    const data = results.map((userExam) => ({
      startTime: userExam.startTime,
      duration: userExam.duration,
      result: userExam.result,
      _id: userExam._id,
      sections:
        userExam.exam.sections?.length === userExam.sections?.length
          ? 'full test'
          : userExam.sections,
      exam: (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sections, ...rest } = userExam.exam; // Loại bỏ sections khỏi exam
        return rest; // Trả về exam mà không có sections
      })(),
    }));
    return {
      data: data,
      totalPages,
      currentPage,
      pageSize,
    };
  }

  async analytics(userId: string, days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const result: {
      [key: string]: {
        // key là "TOEIC" hoặc "ELIT"
        exams: Set<string>; // Set chứa các examId duy nhất
        section: {
          [key: string]: {
            // key là "Listening", "Reading" trong mỗi nhóm
            exams: Set<string>;
            precision: {
              correct: number;
              questionCount: number;
            };
            data: {
              [key: string]: {
                precision: {
                  correct: number;
                  questionCount: number;
                };
              };
            };
          };
        };
        duration: number;
      };
    } = {};
    const userExams = await this.userExamModel
      .find({
        user: userId,
        startTime: { $gte: startDate },
      })
      .populate('exam', 'category')
      .exec();

    for (const userExam of userExams) {
      // 1. Khởi tạo category trong result nếu chưa tồn tại
      const category = userExam.exam.category;
      if (!result[category]) {
        result[category] = {
          exams: new Set(),
          section: {}, // Chứa các danh mục (Listening, Reading, etc.)
          duration: 0,
        };
      }

      // 2. Cập nhật thông tin tổng quan cho category
      const categoryData = result[category]; //toetic, vv...
      categoryData.exams.add(userExam.exam.toString());
      categoryData.duration += userExam.duration;

      // 3. Duyệt qua từng danh mục trong mapSectionCategory
      userExam.mapSectionCategory.forEach((value, section) => {
        // Khởi tạo section trong category nếu chưa tồn tại
        if (!categoryData.section[section]) {
          categoryData.section[section] = {
            exams: new Set(),
            precision: {
              correct: 0,
              questionCount: 0,
            },
            data: {}, // Nếu cần lưu dữ liệu khác
          };
        }

        // Cập nhật thông tin cho section
        const sectionData = categoryData.section[section];
        const date = userExam.startTime;
        // Chuyển đổi ngày, tháng, năm thành định dạng YYYY-MM-DD
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        // Kiểm tra nếu key chưa tồn tại
        if (!sectionData.data[key]) {
          sectionData.data[key] = {
            precision: {
              correct: 0,
              questionCount: 0,
            },
          };
        }
        sectionData.data[key].precision.correct += value.correct;
        sectionData.data[key].precision.questionCount += value.questionCount;
        sectionData.exams.add(userExam.exam.toString());
        sectionData.precision.correct += value.correct;
        sectionData.precision.questionCount += value.questionCount;
      });
    }

    const transformedResult = Object.keys(result).reduce(
      (acc, examCategory) => {
        const categoryData = result[examCategory];
        acc[examCategory] = {
          examsCount: categoryData.exams.size, // Độ dài của Set exams
          secions: Object.keys(categoryData.section).reduce(
            (catAcc, categoryName) => {
              catAcc[categoryName] = {
                examCount: categoryData.section[categoryName].exams.size,
                precision: categoryData.section[categoryName].precision,
                data: Object.keys(categoryData.section[categoryName].data).map(
                  (key) => {
                    const { correct, questionCount } =
                      categoryData.section[categoryName].data[key].precision;
                    return {
                      date: key,
                      precision: (correct * 100) / questionCount,
                    };
                  },
                ),
              };
              // Độ dài của Set trong categorExam
              return catAcc;
            },
            {},
          ),
          duration: categoryData.duration,
        };
        return acc;
      },
      {},
    );

    return transformedResult;
  }
}
