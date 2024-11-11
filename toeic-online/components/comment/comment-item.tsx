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

export const CommentItem = ({
  id,
  content,
  replies,
  user,
  createdAt,
  examId,
}: CommentItemProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      examId: examId,
      repToCommentId: id,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
      </div>
      {replies?.map((reply, index) => (
        <div key={index} className="ml-5">
          <CommentItem
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
};
