import type { Message } from '../types';

type Props = {
  message: Message;
};

export default function UserMessage({ message }: Props) {
  return (
    <div className="max-w-[82%] self-end">
      <div className="px-3.5 py-2.5 rounded-2xl rounded-br-sm text-[13px] leading-relaxed bg-brand-green text-[#C0DD97]">
        {message.content}
      </div>
      <div className="text-[10px] text-txt-subtle mt-0.5 px-1 text-right">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}
