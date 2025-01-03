

export const RecordBtn = () => {
    return (
      <button 
        className='floating-btn fixed bottom-10 right-10 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg flex items-center justify-center hover:from-purple-600 hover:to-indigo-600 transition-transform transform hover:scale-110'
        // onClick={() => alert('AI Chat activated!')}
      >
        <i className="fa-solid fa-microphone"></i>
      </button>
    );
  };