import { Comment } from "@/types";
import { formatDate } from "@/utils/dateUtils";
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
import { memo, useState } from "react";
import axios from "axios";
import { Textarea } from "../ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
export interface CommentItemProps {
  id: string;
  user: {
    _id: string;
    name: string;
  };
  content: string;
  replies: Comment[];
  createdAt: string;
  examId: string;
}

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Username must be at least 2 characters.",
  }),
  examId: z.string(),
  repToCommentId: z.string(),
});

export const CommentItem = memo(
  ({ id, content, replies, user, createdAt, examId }: CommentItemProps) => {
    const isLogin = useSelector((state: RootState) => state.data.isLogin);
    const [comments, setComments] = useState<Comment[]>(replies);
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        content: "",
        examId: examId,
        repToCommentId: id,
      },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      setIsReplying(false);
    };

    return (
      <div className="p-2 ">
        {/* User Information */}
        <div className="flex items-center mb-4">
          <strong className="text-lg font-semibold text-gray-800">
            {user.name}
          </strong>
          <span className="text-sm text-gray-500 ml-2">
            {formatDate(createdAt)}
          </span>
        </div>

        <Textarea
          value={content}
          readOnly
          className="w-full p-4 border border-gray-200 rounded-lg resize-none bg-white text-black cursor-default"
        />

        {/* Reply Section */}
        <div className="mb-4">
          {isLogin && (
            <button
              onClick={() => setIsReplying(!isReplying)} // Toggle reply form visibility
              className="text-blue-600 hover:underline cursor-pointer text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Trả lời
            </button>
          )}
          {isReplying && ( // Conditionally render the reply form
            <div className="mt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Bình luận</FormLabel>
                        <FormControl>
                          <Textarea
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none h-32"
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
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    >
                      Gửi
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>

        {/* Replies */}
        {comments.length > 0 && (
          <div className="pl-6 border-l border-gray-200 mt-4 space-y-4">
            {comments.map((reply) => (
              <CommentItem
                key={reply._id}
                examId={examId}
                id={reply._id}
                content={reply.content}
                replies={reply.replies}
                user={reply.user}
                createdAt={reply.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";
