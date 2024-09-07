"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "lucide-react";
import { LoaderIcon } from "react-hot-toast";
import { BsYoutube } from "react-icons/bs";

import { Button } from "@aperturs/ui/button";
import { Input } from "@aperturs/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@aperturs/ui/select";

interface RepurposeInputProps {
  onSubmit: (data: { url: string; urlType: "url" | "youtube" }) => void;
  loading?: boolean;
}

export default function RepurposeInput({
  onSubmit,
  loading,
}: RepurposeInputProps) {
  const [url, setUrl] = useState("");
  const [urlType, setUrlType] = useState<"url" | "youtube">("url");
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const youtubeRegex =
      // eslint-disable-next-line no-useless-escape
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}(\?.*)?$/;

    const urlRegex =
      // eslint-disable-next-line no-useless-escape
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (youtubeRegex.test(url)) {
      setUrlType("youtube");
      setIsValid(true);
    } else if (urlRegex.test(url)) {
      setUrlType("url");
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      console.log("Submitted:", { url, urlType });
      onSubmit({ url, urlType: urlType });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full flex-col items-center gap-3 sm:flex-row"
    >
      <motion.div
        className="relative w-full sm:w-[70%]"
        initial={false}
        animate={{
          scale: isFocused ? 1.007 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex  items-center pl-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={urlType}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {urlType === "youtube" ? (
                <BsYoutube className="h-5 w-5 text-red-500" />
              ) : (
                <Link className="h-5 w-5 text-blue-500" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <Input
          type="text"
          placeholder="Enter YouTube video or article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={loading}
          className="w-full py-6 pl-10 pr-28"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Select
            value={urlType}
            onValueChange={(e) => {
              setUrlType(e as "url" | "youtube");
            }}
          >
            <SelectTrigger>
              <SelectValue className="mr-2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="url">URL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
      <AnimatePresence>
        {isValid && (
          <motion.div
            className="w-full sm:w-fit"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              isLoading={loading}
              disabled={!isValid || loading}
              type="submit"
              className="w-full bg-lime-950 py-6 text-lg font-medium  text-lime-300 shadow-none dark:bg-lime-400/10 dark:text-lime-400"
            >
              Generate
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
