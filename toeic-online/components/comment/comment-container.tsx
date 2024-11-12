import { Comment } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CommentItem } from "./comment-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const formSchema = z.object({
  content: z.string().min(1, {
    message: "Bình luận phải có ít nhất 1 kí tự",
  }),
  examId: z.string(),
});
interface CommentSectionProps {
  examId: string;
}
export const CommentContainer = ({ examId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      examId: examId,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/by-exam`,
          {
            params: {
              examId: examId,
            },
          }
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };
    fetchComments();
  }, [examId]);
  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bình luận</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Chia sẽ cảm nghĩ của bạn ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Gửi</Button>
          </form>
        </Form>
      </div>
      {comments?.map((comment, index) => (
        <CommentItem
          id={comment._id}
          content={comment.content}
          replies={comment.replies}
          user={comment.user}
          createdAt={comment.createdAt}
          examId={examId}
          key={index}
        />
      ))}
    </div>
  );
};
