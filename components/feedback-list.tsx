"use client";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ThumbsUp, User } from "lucide-react";
import { STATUS_GROUPS } from "@/app/data/status-data";
import { Badge } from "./ui/badge";
import { getCategoryDesign } from "@/app/data/category-data";
import { Button } from "./ui/button";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function FeedbackList({
  initialPosts,
  clerkUserId,
  dbUserId,
}: {
  initialPosts: any[];
  clerkUserId: string | null;
  dbUserId: number | null;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [votingPosts, setVotingPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleVote = async (postId: number) => {
    if (!clerkUserId) {
      toast.error("Please sign in to vote on feedback");
      return;
    }

    if (votingPosts.has(postId)) return;

    setVotingPosts((prev) => new Set(prev).add(postId));

    // Show loading toast
    const loadingToast = toast.loading("Submitting vote...");

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Vote failed");
      }
      const data = await response.json();

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(data.voted ? "Vote added!" : "Vote removed");

      // Update local state
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            const voteCount = post.votes.length;
            return {
              ...post,
              votes: data.voted
                ? [...post.votes, { userId: dbUserId }]
                : post.votes.filter((v: any) => v.userId !== dbUserId),
              _count: {
                votes: data.voted ? voteCount + 1 : voteCount - 1,
              },
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Failed to submit vote.", error);
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.error("Failed to submit vote. Please try again");
    } finally {
      setVotingPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="hover:shadow-md transition-shadow border"
        >
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <User className="h-3 w-3" />
                  <span className="truncate">{post.author.name}</span>
                  <span>|</span>
                  <span className="whitespace-nowrap">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {/* Status Badge */}
                {(() => {
                  const statusGroup =
                    STATUS_GROUPS[post.status as keyof typeof STATUS_GROUPS];
                  if (!statusGroup) return null;
                  const StatusIcon = statusGroup.icon;

                  return (
                    <Badge
                      className={`${statusGroup.countColor} border ${statusGroup.color} flex items-center gap-1`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusGroup.title}
                    </Badge>
                  );
                })()}
                {/* Category Badge */}
                {(() => {
                  const design = getCategoryDesign(post.category);
                  const Icon = design.icon;

                  return (
                    <Badge
                      variant="outline"
                      className={`text-xs ${design.border} ${design.text} flex items-center gap-1`}
                    >
                      <Icon className="h-3 w-3" />
                      {post.category}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">{post.description}</p>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={votingPosts.has(post.id)}
                onClick={() => handleVote(post.id)}
                className="gap-2 cursor-pointer"
              >
                <ThumbsUp
                  className={`h-4 w-4 ${
                    post.votes.some((v: any) => v.userId === dbUserId)
                      ? "fill-current"
                      : ""
                  }`}
                />
                {post.votes.length} Votes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}