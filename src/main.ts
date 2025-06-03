import { exec } from "node:child_process";
import { readdir } from "node:fs/promises";
import ffmpeg from "ffmpeg-static";

const slices = () => {
  const audioPath = "hamlet.mp3";

  const command = `${ffmpeg} -i ${audioPath} -f segment -segment_time 15 -c copy "audios/output_%03d.mp3"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Erro ao dividir o áudio:", err);
      return;
    }
    console.log("Áudio dividido com sucesso!");
  });
};

const main = async () => {
  console.log("Starting transcription...");
  const files = await readdir("./audios");
  console.log("files", files);
  for (const file of files) {
    console.log(`Transcribing file: ${file} ${new Date().toISOString()}`);
    const audioText = await transcribeAudio(`./audios/${file}`);
    console.log("audioText", audioText);
  }

  console.log("Transcription completed.");
};

const transcribeAudio = async (audioFile: string) => {
  return new Promise((resolve, reject) => {
    exec(
      `whisper ${audioFile} --language pt --model base --output_format txt --output_dir ./transcriptions`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          // reject(error);
          resolve("");
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          // reject(new Error(stderr));
          resolve("");
          return;
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      }
    );
  });
};

// slices();
main();
