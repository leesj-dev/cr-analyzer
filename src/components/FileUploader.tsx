// src/components/FileUploader.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadCloud } from 'lucide-react';

interface Props {
  onUpload: (files: File[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function FileUploader({ onUpload, setIsLoading }: Props) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      // 로딩 UI를 보여주기 위해 약간의 딜레이를 줌
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpload(Array.from(e.target.files));
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Clash Royale 덱 분석기</CardTitle>
        <CardDescription>
          RoyaleAPI에서 다운받은 .csv 로그 파일을 업로드하세요.<br></br>여러 파일을 동시에 선택할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">파일을 여기에 드래그하거나 아래를 클릭하세요</p>
          <Input
            id="file-upload"
            type="file"
            multiple
            accept=".csv"
            onChange={handleFileChange}
            className="sr-only" // 실제 인풋은 숨기고 라벨로 감싸서 클릭 유도
          />
          <label
            htmlFor="file-upload"
            className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
          >
            파일 선택
          </label>
        </div>
      </CardContent>
    </Card>
  );
}