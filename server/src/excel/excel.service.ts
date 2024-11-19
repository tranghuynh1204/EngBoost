import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as XLSX from 'xlsx';
@Injectable()
export class ExcelService {
  async readFile(file: any): Promise<any[]> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    } catch {
      throw new HttpException('Lỗi khi đọc file Excel', HttpStatus.BAD_REQUEST);
    }
  }
  async parseToExam(file: any): Promise<any> {
    const jsonData = await this.readFile(file);

    const exam = {
      title: '',
      duration: 0,
      category: '',
      sections: [],
      sectionCount: 0,
      questionCount: 0,
    };

    // Đọc thông tin tiêu đề, thời gian thi, và loại bài thi
    exam.title = jsonData[0][1]; // Tiêu đề
    exam.duration = Number(jsonData[1][1]); // Thời gian thi
    exam.category = jsonData[2][1]; // Loại bài thi

    if (!exam.title) {
      throw new HttpException(
        'Tiêu đề không được để trống.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (isNaN(exam.duration) || exam.duration <= 0) {
      throw new HttpException(
        'Thời gian thi phải là một số dương.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!exam.category) {
      throw new HttpException(
        'Loại bài thi không được để trống.',
        HttpStatus.BAD_REQUEST,
      );
    }

    let currentSection = null;
    let currentGroup = null;
    let mapTagQuestion = null;
    let mapQuestion = null;

    let i = 6; // Khởi tạo biến đếm cho hàng bắt đầu từ hàng thứ 6

    // Vòng lặp while để kiểm tra hàng rỗng và lặp qua dữ liệu
    while (jsonData[i].length !== 0) {
      const row = jsonData[i];

      // Kiểm tra nếu hàng là tiêu đề phần thi
      if (row[0]) {
        if (currentSection) {
          if (!currentSection.name) {
            throw new HttpException(
              'Phần thi phải có tên',
              HttpStatus.BAD_REQUEST,
            );
          }
          if (currentSection.questionCount === 0) {
            throw new HttpException(
              'Phần thi có ít nhất 1 câu hỏi',
              HttpStatus.BAD_REQUEST,
            );
          }
          exam.sectionCount++;
          exam.questionCount += currentSection.questionCount;
          exam.sections.push(currentSection); // Thêm phần thi trước đó vào danh sách
        }

        // Khởi tạo phần thi mới
        currentSection = {
          name: row[0],
          category: row[1],
          tags: [],
          groups: [],
          questionCount: 0,
        };
        currentGroup = null;
        if (mapTagQuestion) {
          mapTagQuestion.forEach((value, key) => {
            value.forEach((serial) => {
              mapQuestion.get(serial).tags.push(key);
            });
          });
        }
        mapQuestion = new Map();
        mapTagQuestion = new Map();
      }
      if (row[2]) {
        currentSection.tags.push(row[2]);
        if (!row[3]) {
          throw new HttpException(
            'Tồn tại 1 tag không có câu hỏi nào.',
            HttpStatus.BAD_REQUEST,
          );
        }

        mapTagQuestion.set(
          row[2],
          typeof row[3] === 'string' ? row[3].split(' ') : [row[3].toString()],
        );
      }
      if (row[12] || row[13] || row[14]) {
        currentGroup = {
          documentText: row[12],
          audio: row[13],
          image: row[14],
          transcript: row[15],
          questions: [],
        };
        currentSection.groups.push(currentGroup);
      }
      if (currentSection) {
        const question = {
          serial: row[4],
          content: row[5], // Câu hỏi
          options: [row[6], row[7], row[8], row[9]].filter(
            (x) => x !== null && x !== undefined,
          ),
          correctAnswer: row[10],
          answerExplanation: row[11],
          tags: [],
        };
        mapQuestion.set(row[4].toString(), question);

        if (!question.serial) {
          throw new HttpException(
            'Số thứ tự không được để trống.',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!question.correctAnswer) {
          throw new HttpException(
            'Đáp án đúng không được để trống.',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!currentGroup) {
          currentGroup = {
            questions: [],
          };
          currentSection.groups.push(currentGroup);
        }
        currentSection.questionCount++;
        currentGroup.questions.push(question);
      }

      i++;
    }

    // Thêm phần thi cuối cùng nếu có
    if (currentSection) {
      exam.sectionCount++;
      exam.questionCount += currentSection.questionCount;
      exam.sections.push(currentSection);
      mapTagQuestion.forEach((value, key) => {
        value.forEach((serial) => {
          mapQuestion.get(serial).tags.push(key);
        });
      });
    }

    // Kiểm tra xem bài thi có phần thi nào không
    if (exam.sections.length === 0) {
      throw new HttpException(
        'Phải có ít nhất 1 phần thi',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Trả về kết quả cùng với số liệu đếm
    return exam;
  }
}
