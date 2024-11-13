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
  const [comments, setComments] = useState<Comment[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      examId: examId,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        values,
        {
          headers: {
            Authorization: `Bearer YOUR_TOKEN_HERE`,
            "Content-Type": "application/json",
          },
        }
      );
      setComments([response.data, ...comments]);
      form.reset();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
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
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [examId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Comment Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bình luận</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Bình luận</FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                      placeholder="Chia sẻ cảm nghĩ của bạn..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Gửi
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              id={comment._id}
              content={comment.content}
              replies={comment.replies}
              user={comment.user}
              createdAt={comment.createdAt}
              examId={examId}
              key={comment._id}
            />
          ))
        ) : (
          <p className="text-gray-500">Không có bình luận nào.</p>
        )}
      </div>
    </div>
  );
};
