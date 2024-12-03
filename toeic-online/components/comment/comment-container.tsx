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
import { Textarea } from "../ui/textarea";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Bình luận phải có ít nhất 1 kí tự",
  }),
  examId: z.string(),
});

export const CommentContainer = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const isLogin = useSelector((state: RootState) => state.data.isLogin);
  const params = useParams();
  const [isFetchingComments, setIsFetchingComments] = useState<boolean>(false); // Separate loading for fetching comments
  const [isSubmittingComment, setIsSubmittingComment] =
    useState<boolean>(false); // Separate loading for submitting a comment

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      examId: params.examId as string,
    },
  });

  const fetchComments = async () => {
    setIsFetchingComments(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/by-exam`,
        {
          params: {
            examId: params.examId,
            offset: comments.length,
          },
        }
      );
      if (comments.length !== 0) {
        setComments([...comments, ...response.data]);
      } else {
        setComments(response.data);
      }
    } catch (error) {
    } finally {
      setIsFetchingComments(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmittingComment(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setComments([response.data, ...comments]);
      form.reset();
    } catch (error) {
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [params.examId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">Bình luận</h2>
        {isLogin ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Bình luận</FormLabel>
                    <FormControl>
                      <Textarea
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
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  disabled={isSubmittingComment} // Disable button while submitting
                >
                  {isSubmittingComment ? "Đang gửi..." : "Gửi"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div>Vui lòng đăng nhập để bình luận</div>
        )}

        <div className="space-y-6">
          {isFetchingComments ? (
            <p className="text-center text-gray-500">Đang tải bình luận...</p>
          ) : comments.length > 0 ? (
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

      <div className="flex justify-center mt-6">
        <Button
          onClick={() => {
            fetchComments();
          }}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
        >
          Tải thêm
        </Button>
      </div>
    </div>
  );
};
