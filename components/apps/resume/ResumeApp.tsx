"use client";

import { asset } from "@/core/config/base-path";

const EMAIL = "tamirlanzhamalov@gmail.com";
const RESUME_PDF = asset("/assets/resume/Tamirlan_Zhamalov_CV.pdf");

const actionButton =
  "rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]";

export function ResumeApp() {
  return (
    <div className="flex h-full flex-col bg-[#525659] text-[11px] text-black">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2.5">
        <div>
          <p className="text-[15px] font-bold text-[#003399]">
            Тамирлан Жамалов
          </p>
          <p className="text-[#4a5a70]">
            Разработчик · AI-инженер · преподаватель
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noreferrer"
            className={actionButton}
          >
            Открыть в новой вкладке
          </a>
          <a href={RESUME_PDF} download className={actionButton}>
            Скачать
          </a>
          <a href={`mailto:${EMAIL}`} className={actionButton}>
            Нанять меня
          </a>
        </div>
      </div>
      <object
        data={`${RESUME_PDF}#view=FitH`}
        type="application/pdf"
        aria-label="Резюме Тамирлана Жамалова"
        className="min-h-0 w-full flex-1"
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-6 text-center text-[#4a5a70]">
          <p>Этот браузер не показывает PDF внутри окна.</p>
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noreferrer"
            className={actionButton}
          >
            Открыть резюме
          </a>
        </div>
      </object>
    </div>
  );
}
