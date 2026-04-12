import { GradientHeader } from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PlusIcon, Map } from "lucide-react";
import Link from "next/link";
import { getCategoryDesign } from "../data/category-data";
import { Badge } from "@/components/ui/badge";
import FeedbackList from "@/components/feedback-list";
import { SubmitFeedbackButton } from "@/components/submit-feedback-button";

export default async function FeedbackPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const categoryFilter = searchParams?.category as string | undefined;

  // Get the useId from clerk auth
  const { userId } = await auth();

  let dbUserId = null;
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });
    dbUserId = dbUser?.id || null;
  }

  const posts = await prisma.post.findMany({
    where: categoryFilter ? { category: categoryFilter } : undefined,
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.post.groupBy({
    by: ["category"],
    _count: true,
  });
  
  return (
    <>
      <div className="space-y-6">
        <GradientHeader
          title="Community Feedback"
          subtitle="Explore, vote, and contribute to the features that matter most. Your voice shapes our product's future."
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6">
            <SubmitFeedbackButton
              size="default"
              className="bg-white text-blue-600 hover:bg-gray-100 cursor-pointer w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8"
            >
              <PlusIcon className="ml-2 h-4 w-4" />
              New Feedback
            </SubmitFeedbackButton>
            <Button
              asChild
              size="default"
              className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8"
            >
              <Link href="/roadmap">
                <Map className="ml-2 h-4 w-4" />
                View Roadmap
              </Link>
            </Button>
          </div>
        </GradientHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Browse feedback by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link
                    href="/feedback"
                    scroll={false}
                    className={`group flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                      !categoryFilter ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    <span className="font-medium text-sm">All Categories</span>
                  </Link>
                  {categories.map((cat) => {
                    const design = getCategoryDesign(cat.category);
                    const Icon = design.icon;

                    return (
                      <Link
                        href={`/feedback${
                          categoryFilter === cat.category
                            ? ""
                            : `?category=${encodeURIComponent(cat.category)}`
                        }`}
                        scroll={false}
                        key={cat.category}
                        className={`group flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                          categoryFilter === cat.category
                            ? "bg-muted"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${design.light} ${design.border} border`}
                          >
                            <Icon className={`h-4 w-4 ${design.text}`}></Icon>
                          </div>
                          <span className="font-medium text-sm">
                            {cat.category}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${design.light} ${design.text}`}
                        >
                          {cat._count}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div 
              className="hidden lg:block sticky top-0 h-6 bg-background z-20 -mx-4 -mt-6" 
              aria-hidden="true" 
            />
            <FeedbackList initialPosts={posts} clerkUserId={userId} dbUserId={dbUserId} />
          </div>
        </div>
      </div>
    </>
  );
}