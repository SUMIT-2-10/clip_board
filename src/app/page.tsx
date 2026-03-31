



const home = () => {
  return (
    <main className="flex flex-col items-center justify-center h-full w-full bg-background text-foreground p-6 ">
      <h1 className="text-4xl font-bold mb-4">Welcome h to ClipBoard!</h1>
      <p className="text-lg max-w-2xl text-center mb-8">
        <span className="font-semibold">ClipBoard</span> is your modern solution for quickly sharing and retrieving text or files across devices. Whether you want to copy important notes, share code snippets, or transfer files securely, ClipBoard makes it effortless and fast.
      </p>
      <div className="bg-card shadow-md rounded-lg p-6 max-w-xl w-full mb-8">
        <h2 className="text-2xl font-semibold mb-2">What is a Clipboard?</h2>
        <p className="mb-2">
          A clipboard is a temporary storage area for data that the user wants to copy from one place to another. Traditionally, it helps you copy and paste text, images, or files between applications. With ClipBoard, you can extend this power to the web—share content between your devices, or with friends, in seconds!
        </p>
        <ul className="list-disc list-inside text-left ml-4">
          <li>Copy and paste text or files instantly</li>
          <li>Access your clipboard from any device</li>
          <li>Share content securely and privately</li>
          <li>No sign-up required for basic use</li>
        </ul>
      </div>
      <div className="text-center text-muted-foreground">
        <p>Get started by using the navigation above to share or retrieve your clipboard content!</p>
      </div>
    </main>
  );
}

export default home