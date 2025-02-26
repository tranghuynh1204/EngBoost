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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { z } from "zod";

import { closeModal } from "@/lib/store/modal-slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Flashcard } from "@/types";

const formSchema = z.object({
  flashcard: z.string(),
  title: z.string(),
  description: z.string(),
  word: z.string().min(2, { message: "Từ mới phải có ít nhất 2 ký tự." }),
  mean: z.string().min(2, { message: "Định nghĩa phải có ít nhất 2 ký tự." }),
  partOfSpeech: z.string(),
  pronunciation: z.string(),
  notes: z.string(),
  example: z.string(),
  file: z.instanceof(File).optional(),
});
export const CreateVocabularyModal = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, data, type, isReload } = useSelector(
    (state: RootState) => state.modal
  );
  const { vocabulary } = data;
  const flashcardId = vocabulary?.flashcard?._id;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const isModalOpen = isOpen && type === "CreateVocabulary";
  const [createFlashCard, setCreateFlashCard] = useState<boolean>();

  useEffect(() => {
    const fetchVocabulary = async () => {
      console.log("ss");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/flashcards`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setFlashcards(response.data);
        if (!response.data.length) {
          setCreateFlashCard(true);
        } else {
          setCreateFlashCard(false);
        }
      } catch {
        setCreateFlashCard(true);
      }
    };
    if (!flashcardId && isModalOpen) {
      fetchVocabulary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);
  useEffect(() => {
    form.setValue("word", vocabulary?.word ?? "");
    form.setValue("flashcard", flashcardId ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabulary]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flashcard: "",
      title: "",
      description: "",
      word: "",
      mean: "",
      partOfSpeech: "",
      pronunciation: "",
      notes: "",
      example: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    if (createFlashCard) {
      // Kiểm tra trường hợp khi tạo flashcard mới
      if (!values.title || values.title.length < 2) {
        form.setError("title", {
          type: "required",
          message: "Title phải có ít nhất 2 ký tự khi tạo mới danh sách.",
        });
        form.setFocus("title");
        return;
      }

      // Thêm dữ liệu vào formData khi tạo flashcard mới
      formData.append("title", values.title);
      formData.append("description", values.description);
    } else {
      // Kiểm tra trường hợp khi không tạo flashcard mới
      if (!values.flashcard || values.flashcard.trim() === "") {
        form.setError("flashcard", {
          type: "required",
          message: "Phải chọn 1 list từ vựng",
        });
        form.setFocus("flashcard");
        return;
      }

      // Thêm dữ liệu vào formData khi không tạo flashcard mới
      formData.append("flashcard", values.flashcard);
    }

    if (values.file) {
      formData.append("file", values.file);
    }

    formData.append("word", values.word);
    formData.append("mean", values.mean);
    formData.append("partOfSpeech", values.partOfSpeech);
    formData.append("pronunciation", values.pronunciation);
    formData.append("notes", values.notes);
    formData.append("example", values.example);

    try {
      setIsSubmitting(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/vocabularies`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form hoặc xử lý UI sau khi thành công
      form.reset({
        flashcard: values.flashcard,
        title: "",
        description: "",
        word: "",
        mean: "",
        partOfSpeech: "",
        pronunciation: "",
        notes: "",
        example: "",
        file: undefined,
      });
      dispatch(closeModal());
      if (isReload) {
        window.location.reload();
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        dispatch(closeModal());
      }}
    >
      <DialogContent
        aria-labelledby="dialog-title"
        className="w-[600px] max-w-full max-h-full lg:max-w-screen-lg overflow-y-auto p-6 bg-white rounded-lg shadow-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Thêm từ vựng
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Flashcard Creation */}
            <div>
              {flashcards && !flashcardId && (
                <Button
                  onClick={() => {
                    setCreateFlashCard(!createFlashCard);
                  }}
                  type="button"
                >
                  + Tạo list từ mới
                </Button>
              )}
            </div>

            <div>
              {flashcardId && (
                <div className="text-gray-600">
                  List từ: {vocabulary.flashcard?.title}
                </div>
              )}
              {!flashcardId && flashcards.length > 0 && !createFlashCard && (
                <FormField
                  control={form.control}
                  name="flashcard"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm text-gray-700">
                        Chọn list từ vựng
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            ref={field.ref}
                            className="w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                          >
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
              {createFlashCard && !flashcardId && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm text-gray-700">
                          Tiêu đề
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm text-gray-700">
                          Mô tả
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Main Vocabulary Form Fields */}
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm text-gray-700">
                    Từ mới
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mean"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm text-gray-700">
                    Định nghĩa
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Accordion for Additional Information */}
            <Accordion
              type="single"
              collapsible
              className="border-2 rounded-lg"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="bg-gray-200 text-black p-3 rounded-md hover:bg-gray-300 transition duration-200">
                  Thêm phiên âm, ví dụ, ảnh, ghi chú ...
                </AccordionTrigger>
                <AccordionContent className="space-y-4 p-4">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm text-gray-700">
                          Ảnh
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              onChange(
                                event.target.files && event.target.files[0]
                              )
                            }
                            className="w-full border rounded-md p-2"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 italic font-semibold mt-1 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partOfSpeech"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm text-gray-700">
                          Từ loại
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pronunciation"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm text-gray-700">
                          Phiên âm
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="example"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm text-gray-700">
                          Ví dụ
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm text-gray-700">
                          Ghi chú
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 italic font-semibold mt-1"></FormMessage>
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
