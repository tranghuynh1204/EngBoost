import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as XLSX from 'xlsx';
@Injectable()
export class ExcelService {
  async readFile(file: any): Promise<Record<string, any[]>> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });

      // Khởi tạo đối tượng chứa dữ liệu từ tất cả các sheet
      const sheetsData: Record<string, any[]> = {};

      // Duyệt qua từng sheet trong workbook
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển sheet thành JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // 'header: 1' trả về mảng
        sheetsData[sheetName] = data;
      });

      return sheetsData;
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

    const firstSheetName = Object.keys(jsonData)[0];
    const firstSheetData = jsonData[firstSheetName];
    exam.title = firstSheetData[0][1];
    exam.duration = Number(firstSheetData[1][1]);
    exam.category = firstSheetData[2][1];
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

    for (let i = 1; i < Object.keys(jsonData).length; i++) {
      const sheetName = Object.keys(jsonData)[i];
      const sheetData = jsonData[sheetName];

      // Vòng lặp while để kiểm tra hàng rỗng và lặp qua dữ liệu
      for (let j = 1; j < sheetData.length; j++) {
        const row = sheetData[j];

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
            typeof row[3] === 'string'
              ? row[3].split(' ')
              : [row[3].toString()],
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
      }
    }
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
