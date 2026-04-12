// POST /api/drive/upload
// Body: { videoUrl: string, modelName: string, jobName: string }
// Upload video to Google Drive

export async function POST(req: Request) {
  const { videoUrl, modelName, jobName } = await req.json();

  // TODO: implement Google Drive upload
  // For now, return success with a stub

  return Response.json({
    success: true,
    message: `Video ${jobName} ready for ${modelName}`,
    driveUrl: `https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_VIDEOS_ALL_FOLDER}`
  });
}
