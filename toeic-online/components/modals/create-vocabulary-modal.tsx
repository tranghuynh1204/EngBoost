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
import { TbCodePlus, TbHeartPlus, TbProgressCheck } from "react-icons/tb";
import { toast } from "@/hooks/use-toast";

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
          message: "Title must have at least 2 characters when creating a new list.",
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
          message: "You must select a vocabulary list.",
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
      
      toast({
        title: "Success!",
        description: (
          <div className="flex items-center space-x-2">
            <TbProgressCheck className="text-green-600" size={18} />
            <span>Vocabulary added successfully.</span>
          </div>
        ),
        variant: "success",
      });

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
        className="w-[700px] max-w-full max-h-[95vh] lg:max-w-screen-lg overflow-y-auto p-6 bg-slate-50 rounded-lg shadow-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add new vocabulary
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white border border-slate-500  rounded-xl p-4">
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
                    className="text-sm text-zinc-700 font-light px-2 py-3 bg-white  "
                  >
                    <TbHeartPlus className="text-rose-400" size={18} />{" "}
                    {createFlashCard ? "Use Saved List" : "New Flashcard"}
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
                          Select Vocabulary List
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              ref={field.ref}
                              className="w-full border border-slate-500 text-sm rounded-md  focus:ring-2 focus:ring-cyan-500"
                            >
                              <SelectValue placeholder="Chọn list từ vựng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {flashcards.map((flashcard) => (
                              <SelectItem
                                key={flashcard._id}
                                value={flashcard._id}
                                className="text-sm"
                              >
                                {flashcard.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-rose-500"/>
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
                          <FormLabel className="text-sm text-gray-700  ">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full border p-2  border-slate-500 rounded-md  focus:ring-2 focus:ring-sky-500"
                            />
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm text-gray-700">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full border p-2  border-slate-500 rounded-md  focus:ring-2 focus:ring-sky-500"
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
                      New word
                    </FormLabel>
                    <FormControl className="text-xs">
                      <Input
                        {...field}
                        className="text-xs bg-white  border border-slate-500 rounded-md p-2 focus:ring-2 focus:ring-sky-400"
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
                      Definition
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="w-full bg-white border border-slate-500 rounded-md p-2 focus:ring-2 focus:ring-sky-400"
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
                className="border border-slate-500 bg-white rounded-lg"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="items-center bg-white text-zinc-700 p-3 rounded-md hover:bg-slate-50 transition duration-200">
                    <TbCodePlus size={18} />
                    Add Pronunciation, Example, Image, Notes ...
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    <FormField
                      control={form.control}
                      name="file"
                      render={({
                        field: { value, onChange, ...fieldProps },
                      }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm text-gray-700 font-semibold">
                            Image
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
                              className="w-full border border-slate-500 rounded-md p-2"
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
                          <FormLabel className="text-sm text-gray-700 font-semibold">
                            Word form
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full border border-slate-500 rounded-md p-2 focus:ring-2 focus:ring-sky-400"
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
                          <FormLabel className="text-sm text-gray-700 font-semibold">
                          Pronunciation
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full border border-slate-500 rounded-md p-2 focus:ring-2 focus:ring-sky-400"
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
                          <FormLabel className="text-sm text-gray-700 font-semibold">
                            Example
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full border border-slate-500 rounded-md p-2 focus:ring-2 focus:ring-sky-400"
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
                          <FormLabel className="text-sm text-gray-700 font-semibold">
                            Note
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full border border-slate-500 rounded-md p-2 focus:ring-2 focus:ring-sky-400"
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
              <div className="flex font-semibold justify-center">
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
