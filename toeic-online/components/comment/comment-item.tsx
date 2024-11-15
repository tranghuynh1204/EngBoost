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
import { Input } from "@/components/ui/input";
import { memo, useState } from "react";
import axios from "axios";
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
    const [comments, setComments] = useState<Comment[]>(replies);
    console.log("a");
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
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMTU5NjUzNywiZXhwIjoxNzMyMjAxMzM3fQ.YQvEJL2AdaIPzIbFgDhNMTOOu3YEgZQ-mY5n9_lNyfk`,
            "Content-Type": "application/json",
          },
        }
      );
      setComments([response.data, ...comments]);
      form.reset();
    };

    return (
      <div>
        <strong>
          {user.name}, {formatDate(createdAt)}
        </strong>
        <div>{content}</div>
        <div>
          trả lời
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
        </div>
        {comments?.map((reply, index) => (
          <div key={index} className="ml-5">
            <CommentItem
              examId={examId}
              id={reply._id}
              content={reply.content}
              replies={reply.replies}
              user={reply.user}
              createdAt={reply.createdAt}
            />
          </div>
        ))}
      </div>
    );
  }
);
CommentItem.displayName = "CommentItem";
