import { Button } from "@/components/ui/button";

function RequestToUser() {
  return (
    <div className="h-screen m-4 border-slate-600 border-2 rounded-md p-2">
      <div className="text-center text-4xl p-2 underline underline-offset-4 mb-4">
        Requests
      </div>
      <div className="flex bg-neutral-300 justify-center items-center p-3 rounded-md">
        <div className="flex-1 text-xl">Update the phone number</div>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-blue-400 rounded-full py-1 px-4">Status</div>
          <Button>Approve</Button>
        </div>
      </div>
    </div>
  );
}

export default RequestToUser;
