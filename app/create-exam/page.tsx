import { Suspense } from "react";
import CreateExam from "./CreateExam";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateExam />
    </Suspense>
  );
}