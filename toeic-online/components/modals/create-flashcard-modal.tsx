"use client";
import { RootState } from "@/lib/store/store";
import React, { useState } from "react";
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

import { Input } from "@/components/ui/input";
import { z } from "zod";

import { closeModal } from "@/lib/store/modal-slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { TbProgressCheck } from "react-icons/tb";

const formSchema = z.object({
  title: z.string().min(2, { message: "title phải có ít nhất 2 ký tự." }),
  description: z.string(),
});
export const CreateFlashcardModal = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, type } = useSelector((state: RootState) => state.modal);

  const isModalOpen = isOpen && type === "CreateFlashcard";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/flashcards`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      form.reset();
      dispatch(closeModal());
      toast({
        title: "Success!",
        description: (
          <div className="flex items-center space-x-2">
            <TbProgressCheck className="text-green-600" size={18} />
            <span>Flashcard created successfully.</span>
          </div>
        ),
        variant: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Failed to update vocabulary:", error);
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
        ria-labelledby="dialog-title"
        className="w-[700px] max-w-full max-h-[95vh] lg:max-w-screen-lg overflow-y-scroll p-6 bg-slate-50 rounded-lg shadow-xl"
      >
        {/* Chỉnh độ dài ở đây nè nhưng tuyệt đối không được bỏ cái max-w-full */}
        <DialogHeader>
          <DialogTitle>Add Flashcard</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
