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
  title: z.string().min(2, { message: "Title must have at least 2 characters." }),
  description: z.string(),
});
export const UpdateFlashcardModal = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, data, type } = useSelector((state: RootState) => state.modal);
  const { flashcard } = data;
  const isModalOpen = isOpen && type === "UpdateFlashcard";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: flashcard?.title,
      description: flashcard?.description,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/flashcards/${flashcard?._id}`,
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
            <span>Flashcard updated successfully.</span>
          </div>
        ),
        variant: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    form.setValue("title", flashcard?.title ?? "");
    form.setValue("description", flashcard?.description ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcard]);
  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        dispatch(closeModal());
      }}
    >
      <DialogContent
        ria-labelledby="dialog-title"
        className="w-[600px] max-w-full max-h-full bg-slate-50 lg:max-w-screen-lg overflow-y-scroll"
      >
        {/* Chỉnh độ dài ở đây nè nhưng tuyệt đối không được bỏ cái max-w-full */}
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-zinc-500 hover:bg-zinc-700 text-white">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
