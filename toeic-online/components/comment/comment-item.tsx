import { Comment, formatDate } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { memo, useState } from "react";
import axios from "axios";
import { Textarea } from "../ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import ChevronUpIcon from "@heroicons/react/24/solid/ChevronUpIcon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import { ReplyIcon } from "lucide-react";
import Image from "next/image";
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
    const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);
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
      <div className="space-y-4 p-4 border-b border-gray-200">
        {/* User Information */}
        <div className="flex items-start space-x-4">
          {/* User Avatar */}
          <Image
            src={`https://i.pinimg.com/736x/12/4f/41/124f41d139c139f8c0a9e323c94176ca.jpg`}
            alt="User Avatar"
            width={40} // Specify the width
            height={40}
            className="w-10 h-10 rounded-full"
          />

          {/* Comment Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-base font-medium text-gray-900">{user.name}</p>
              <span className="text-xs text-gray-500">
                {formatDate(createdAt)}
              </span>
            </div>
            <p className="text-gray-800 text-sm bg-white p-3 rounded-lg">
              {content}
            </p>

            {/* Reply Button */}
            {isLogin && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="mt-2 flex items-center text-sm text-blue-600 hover:underline"
              >
                <ReplyIcon className="w-5 h-5 mr-1" />
                Trả lời
              </button>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="pl-14">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Viết câu trả lời của bạn..."
                          className="w-full resize-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Gửi
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Toggle Replies */}
        {comments.length > 0 && (
          <div>
            <button
              onClick={() => setIsRepliesOpen(!isRepliesOpen)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              {isRepliesOpen ? (
                <ChevronUpIcon className="w-5 h-5 mr-1" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 mr-1" />
              )}
              {isRepliesOpen
                ? "Ẩn phản hồi"
                : `Xem ${comments.length} phản hồi`}
            </button>

            {/* Nested Replies */}
            {isRepliesOpen && (
              <div className="pl-14 space-y-4 mt-4">
                {comments.map((reply) => (
                  <CommentItem
                    key={reply._id}
                    id={reply._id}
                    content={reply.content}
                    replies={reply.replies}
                    user={reply.user}
                    createdAt={reply.createdAt}
                    examId={examId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";
