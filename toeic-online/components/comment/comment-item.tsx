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
    message: "Comment must be at least 1 character.",
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
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        content: "",
        examId: examId,
        repToCommentId: id,
      },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      try {
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
      } catch (error) {
        console.error("Failed to submit reply:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
    return (
      <div className="space-y-3 p-2 ">
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
              <p className=" font-medium text-gray-900">{user.name}</p>
              <span className="text-xs text-cyan-600">
                {formatDate(createdAt)}
              </span>
            </div>
            <p className="text-gray-700 text-sm bg-white  rounded-lg whitespace-pre-wrap">
              {content}
            </p>

            {/* Reply Button */}
            {isLogin && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="mt-2 flex items-center text-xs text-cyan-600 hover:underline"
              >
                <ReplyIcon className="w-4 h-4 mr-1" />
                Reply
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
                        <div className="relative">
                          <Textarea
                            placeholder="Write your reply..."
                            className="w-full p-4 text-sm border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none h-28 pr-16"
                            {...field}
                          />
                          <Button
                            type="submit"
                            disabled={isSubmitting || !form.watch("content")}
                            className="absolute bottom-2 text-sm right-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800"
                          >
                            {isSubmitting ? "Sending..." : "Send"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </form>
            </Form>
          </div>
        )}

        {/* Toggle Replies */}
        {comments.length > 0 && (
          <div>
            <button
              onClick={() => setIsRepliesOpen(!isRepliesOpen)}
              className="pl-10 flex items-center text-xs text-gray-500 hover:text-gray-700"
            >
              {isRepliesOpen ? (
                <ChevronUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 mr-1" />
              )}
              {isRepliesOpen ? "Hide reply" : `View ${comments.length} replies`}
            </button>

            {/* Nested Replies */}
            {isRepliesOpen && (
              <div className="pl-8 space-y-1 mt-1">
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
