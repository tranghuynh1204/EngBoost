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
    message: "Comment must be at least 1 character.",
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
  const contentValue = form.watch("content");
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
    } catch  {
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
    } catch  {
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [params.examId]);

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white  border border-slate-400 rounded-2xl p-6">
        <h2 className=" font-semibold mb-4 text-black">Comment</h2>
        {isLogin ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Comment</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          className="w-full p-4 text-sm border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none h-32 pr-16"
                          placeholder="Share your opinion..."
                          {...field}
                        />
                        <Button
                          type="submit"
                          className="absolute bottom-3 right-3 bg-cyan-700 text-sm text-white px-4 py-2 rounded-lg hover:bg-cyan-800 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
                          disabled={isSubmittingComment || !contentValue.trim()}
                        >
                          {isSubmittingComment ? "Sending..." : "Send"}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
            </form>
          </Form>
        ) : (
          <div>Vui lòng đăng nhập để bình luận</div>
        )}

        <div className="mt-8">
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
            <p className=" text-sm text-center text-gray-500">There are no comments yet.</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onClick={() => {
            fetchComments();
          }}
          className="bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-800 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
        >
          Load more
        </Button>
      </div>
    </div>
  );
};
