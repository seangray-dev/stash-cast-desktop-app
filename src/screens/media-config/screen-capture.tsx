export default function ScreenCapture() {
  // If monitor/window/tab is selected, show here
  // If camera is selected while the monitor/window/tab is selected, overlay it (unless settings say otherwise)
  // If monitor/window/tab is off and camera is on, show full screen camera view
  // If monitor/window/tab is off and camera is off, show black screen

  return (
    <div className='flex flex-1 flex-col rounded-lg bg-black/95 shadow-lg'>
      <div className='aspect-video w-full' />
    </div>
  );
}
