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
import { useParams } from "next/navigation";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Bình luận phải có ít nhất 1 kí tự",
  }),
  examId: z.string(),
});

export const CommentContainer = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const params = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      examId: params.examId as string,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        values,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMTU5NjUzNywiZXhwIjoxNzMyMjAxMzM3fQ.YQvEJL2AdaIPzIbFgDhNMTOOu3YEgZQ-mY5n9_lNyfk`,
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
              examId: params.examId,
            },
          }
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [params.examId]);

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
              examId={params.examId as string}
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
