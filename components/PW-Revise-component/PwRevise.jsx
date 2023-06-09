"use client";

import axios from "axios";
import { signOut } from "next-auth/react";
import { useRef, useState } from "react";

const PwRevise = ({ mode, id }) => {
  const [CurrentPwState, setCurrentPwState] = useState(false);
  const [FuturePwState, setFuturePwState] = useState(false);
  const [FuturePwChekerState, setFuturePwChekerState] = useState(false);
  const CurrentPwRef = useRef();
  const FuturePwRef = useRef();
  const FuturePwChekerRef = useRef();

  const ReviseBtnEvent = async () => {
    const spinner = document.getElementById("spinner");
    spinner.classList.toggle("invisible");

    const CurrentPw = CurrentPwRef.current.value;
    const FuturePw = FuturePwRef.current.value;
    const FuturePwCheker = FuturePwChekerRef.current.value;

    if (!CurrentPw || !FuturePw || !FuturePwCheker) {
      spinner.classList.toggle("invisible");
      return alert("빈칸없이 입력해주세요");
    }

    if (FuturePw !== FuturePwCheker) {
      spinner.classList.toggle("invisible");
      return alert("변경칸과 확인칸의 입력값이 다릅니다. 확인해주세요.");
    }

    const data = {
      CurrentPw,
      FuturePw,
      id,
      mode,
    };

    try {
      const result = await axios.post("/api/pw-revise", data);
      if (result.data.success) {
        alert("변경완료");
      } else {
        alert(result.data.msg);
      }
    } catch (error) {
      alert("서버에서 에러가 발생했습니다. 잠시후 다시시도해주세요.");
    }
    spinner.classList.toggle("invisible");
  };

  const DeleteBtnEvent = async () => {
    if (confirm("정말 삭제하시겠습니까? 다시 복구하실 수 없습니다")) {
      const result = await axios.delete("/api/delete");
      if (result.data.success) {
        signOut({ redirect: "/" });
        return alert("삭제 완료");
      } else
        return alert("서버에서 에러가 발생했습니다. 잠시후 다시 시도해주세요");
    }
  };

  return (
    <div className='flex flex-col gap-3 w-full items-center mt-5'>
      <p className='text-[35px]'>계정비밀번호 수정</p>
      <div className='grid items-center pw-revise w-[368px] gap-3'>
        <p className='text-[25px] flex items-center justify-end w-full'>현재</p>
        <input
          type={CurrentPwState ? "text" : "password"}
          onClick={() => setCurrentPwState(true)}
          onBlur={() => setCurrentPwState(false)}
          className='pl-8 bg-slate-200 rounded-full w-full h-[50px]'
          ref={CurrentPwRef}
          placeholder='현재비밀번호를 입력해주세요'
        />
        <p className='text-[25px] flex items-center justify-end w-full'>변경</p>
        <input
          type={FuturePwState ? "text" : "password"}
          onClick={() => setFuturePwState(true)}
          onBlur={() => setFuturePwState(false)}
          className='pl-8 bg-slate-200 rounded-full w-full h-[50px]'
          ref={FuturePwRef}
          placeholder='바꾸실 비밀번호를 입력해주세요'
        />
        <p className='text-[25px] flex items-center justify-end w-full'>확인</p>
        <input
          type={FuturePwChekerState ? "text" : "password"}
          onClick={() => setFuturePwChekerState(true)}
          onBlur={() => setFuturePwChekerState(false)}
          className='pl-8 bg-slate-200 rounded-full w-full h-[50px]'
          ref={FuturePwChekerRef}
          placeholder='위에거랑 똑같이 입력해주세요'
        />
      </div>
      <button
        className='bg-yellow-300 rounded-full w-[230px] text-[30px] shadow-2xl hover:shadow-yellow-300 hover:bg-yellow-400'
        onClick={ReviseBtnEvent}
      >
        변경하기
      </button>
      <button
        className='bg-yellow-300 rounded-full w-[230px] text-[30px] shadow-2xl hover:shadow-yellow-300 hover:bg-yellow-400'
        onClick={DeleteBtnEvent}
      >
        계정삭제하기
      </button>
    </div>
  );
};

export default PwRevise;
