import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { SendIcon } from "lucide-react";
import { Comments } from "./Comments";

function Post({
  caption,
  name,
  mediaUrl,
  postDate,
  profileImage,
  postId,
  userId,
}: {
  caption: string;
  mediaUrl: string;
  postDate: string;
  name: string;
  profileImage: string | null;
  postId: number;
  userId: number;
}) {
  const { currentUser }: any = useContext(AuthContext);

  const [isPostLiked, setIsPostLiked] = useState(false);
  const [commentBox, setCommentBox] = useState(false);

  const handlePostLike = async () => {
    if (!isPostLiked) {
      try {
        await axios.post(
          `${process.env.API_ENDPOINT}/posts/like`,
          { postId },
          { withCredentials: true }
        );
        setIsPostLiked(true);
      } catch (error: any) {
        console.log(error.reponse.data);
      }
    } else {
      try {
        await axios.post(
          `${process.env.API_ENDPOINT}/posts/unlike`,
          { postId },
          { withCredentials: true }
        );
        setIsPostLiked(false);
      } catch (error: any) {
        console.log(error.response.data);
      }
    }
  };

  useEffect(() => {
    console.log("Inside UseEffect");
    const checkLikeStatus = async function () {
      const response = await axios.post(
        `${process.env.API_ENDPOINT}/posts/likedPost`,
        { postId },
        { withCredentials: true }
      );
      setIsPostLiked(response.data);
    };
    checkLikeStatus();
    console.log(isPostLiked);
  }, [isPostLiked, postId]);

  return (
    <div className="flex flex-col w-full rounded-md shadow-lg bg-slate-50">
      <div className="w-full p-2 ">
        <div className="flex gap-2 w-full">
          {profileImage !== null ? (
            <Image
              src={profileImage}
              className="rounded-full shadow-lg "
              width="40"
              height="40"
              alt="Profile pic"
            />
          ) : (
            <Image
              src="/avatar.png"
              className="rounded-full shadow-lg"
              width="40"
              height="40"
              alt="Profile pic"
            />
          )}
          <div className="flex flex-col">
            <h6 className="text-[14px]">{name}</h6>
            <span className="text-[10px] text-muted-foreground">
              {moment(postDate).fromNow()}
            </span>
          </div>
        </div>
        <div className="text-sm p-2">{caption}</div>
      </div>
      <div className="relative">
        <Image
          className="w-auto"
          src={mediaUrl}
          width={400}
          height={400}
          alt="user post"
        />
      </div>
      <div className="flex p-2 gap-2">
        <Button variant={"ghost"} onClick={handlePostLike}>
          {isPostLiked ? "Liked" : "Like"}
        </Button>
        <Button variant={"ghost"} onClick={() => setCommentBox(!commentBox)}>
          5 Comments
        </Button>
      </div>

      <div className="">{commentBox && <Comments postId={postId} />}</div>
    </div>
  );
}

export default Post;
