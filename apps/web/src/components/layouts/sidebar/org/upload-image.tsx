import Image from "next/image";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import { Button } from "~/components/ui/button";

interface UploadImageProps {
  image: File | undefined;
  setImage: (image: File | undefined) => void;
}

export default function UploadImage({ image, setImage }: UploadImageProps) {
  const previewUrl = image ? URL.createObjectURL(image) : null;

  return (
    <div className="flex items-center gap-6">
      <Image
        width={1000}
        height={1000}
        className=" h-24 w-24 rounded-md border object-cover shadow-md"
        src={previewUrl ? previewUrl : "/profile.jpeg"}
        alt="sample pfp"
      />
      <div className="">
        <h3>Upload Logo</h3>
        <p className="mb-1 text-sm text-muted-foreground">
          We support PNGs, JPEGs, SVGs under 5MB
        </p>
        <div className="flex gap-1">
          <label
            htmlFor="orgImage"
            className="inline-block w-fit cursor-pointer text-primary underline"
          >
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => {
                document.getElementById("orgImage")?.click();
              }}
            >
              <FiUpload size="1.2em" className="mr-1" />
              Upload Image
            </Button>
            <input
              type="file"
              accept="image/*"
              id="orgImage"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file?.size && file.size > 5 * 1024 * 1024) {
                  toast.error("File size should be less than 5MB");
                  return;
                }
                if (file) {
                  setImage(file);
                }
              }}
              className="hidden"
            />
          </label>
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => setImage(undefined)}
          >
            <MdDeleteOutline size="1.4em" />
          </Button>
        </div>
      </div>
    </div>
  );
}
