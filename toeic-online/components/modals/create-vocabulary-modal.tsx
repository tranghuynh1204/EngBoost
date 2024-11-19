"use client";
import { RootState } from "@/lib/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { z } from "zod";

import { closeModal } from "@/lib/store/modal-slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Flashcard } from "@/types";

const formSchema = z.object({
  flashcard: z.string().optional(),
  createFlashcardDto: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  word: z.string().min(2, { message: "Từ mới phải có ít nhất 2 ký tự." }),
  mean: z.string().min(2, { message: "Định nghĩa phải có ít nhất 2 ký tự." }),
  partOfSpeech: z.string(),
  pronunciation: z.string(),
  notes: z.string(),
  example: z.string(),
  image: z.instanceof(File).optional(),
});
export const CreateAnswerModal = () => {
  const dispatch = useDispatch();
  const { isOpen, data, type } = useSelector((state: RootState) => state.modal);
  const { vocabulary } = data;
  const flashcardId = vocabulary?.flashcard._id;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const isModalOpen = isOpen && type === "CreateVocabulary";
  const [createFlashCard, setCreateFlashCard] = useState<boolean>(true);

  useEffect(() => {
    // if (isModalOpen && !flashcardId) {
    const fetchVocabulary = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/flashcards`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMjAzMDI2MywiZXhwIjoxNzMyNjM1MDYzfQ.mz-2rj4azAsW_vYmmtRFkItTzZhpO-W_DCEYvctdJ3Q`,
              "Content-Type": "application/json",
            },
          }
        );
        setFlashcards(response.data);
        if (response.data.lenght === 0) {
          setCreateFlashCard(true);
        } else {
          setCreateFlashCard(false);
        }
      } catch {
        setCreateFlashCard(true);
      }
    };

    fetchVocabulary();
    // }
  }, [isModalOpen]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flashcard: "",
      createFlashcardDto: {
        title: "",
        description: "",
      },
      word: "",
      mean: "",
      partOfSpeech: "",
      pronunciation: "",
      notes: "",
      example: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Kiểm tra điều kiện và thiết lập lỗi cho "title" nếu cần
    if (
      createFlashCard &&
      (!values.createFlashcardDto?.title ||
        values.createFlashcardDto.title.length < 2)
    ) {
      form.setError("createFlashcardDto.title", {
        type: "manual",
        message: "Title phải có ít nhất 2 ký tự khi tạo mới danh sách.",
      });
      return;
    }

    // Chuẩn bị payload dựa trên trạng thái `createFlashCard`
    const payload = {
      ...values,
      flashcard: createFlashCard ? undefined : values.flashcard,
      createFlashcardDto: createFlashCard
        ? values.createFlashcardDto
        : undefined,
      image: undefined,
    };
    console.log(payload);
    console.log(values.image);

    // Call API
    // try {
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_API_URL}/vocabulary`,
    //     payload,
    //     {
    //       headers: {
    //         Authorization: `Bearer YOUR_TOKEN_HERE`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   console.log("Success:", response.data);

    //   // Reset form hoặc xử lý UI sau khi thành công
    //   form.reset();
    // } catch (error) {
    //   console.error("API Error:", error);
    //   // Xử lý lỗi từ API nếu cần
    // }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        dispatch(closeModal());
      }}
    >
      <DialogContent
        ria-labelledby="dialog-title"
        className="w-[600px] max-w-full max-h-full lg:max-w-screen-lg overflow-y-scroll"
      >
        {/* Chỉnh độ dài ở đây nè nhưng tuyệt đối không được bỏ cái max-w-full */}
        <DialogHeader>
          <DialogTitle>Thêm từ vựng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              {flashcards && (
                <Button
                  onClick={() => {
                    setCreateFlashCard(!createFlashCard);
                  }}
                  type="button"
                >
                  + Tạo mới
                </Button>
              )}
            </div>
            <div>
              {!flashcardId && flashcards.length > 0 && !createFlashCard && (
                <FormField
                  control={form.control}
                  name="flashcard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn list từ vựng</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={flashcards[0]._id}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn list từ vựng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {flashcards.map((flashcard) => (
                            <SelectItem
                              key={flashcard._id}
                              value={flashcard._id}
                            >
                              {flashcard.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {createFlashCard && (
                <div>
                  <FormField
                    control={form.control}
                    name="createFlashcardDto.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tạo list từ mới</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="createFlashcardDto.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Từ mới</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mean"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Định nghĩa</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partOfSpeech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Từ loại</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pronunciation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phiên âm</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ví dụ</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
