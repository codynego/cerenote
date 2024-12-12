interface AuthBtnProps {
    fetching: boolean;
    text: string;
  }
  
  export const AuthBtn: React.FC<AuthBtnProps> = ({ fetching, text }) => {
    return (
      <button 
        type="submit" 
        className="flex justify-center items-center w-full py-3 bg-gradient-to-r from-[#691476] to-[#100e53] text-white rounded-full hover:bg-blue-900">
        {fetching ? <div className='loader'></div> : text}
      </button>
    );
  };