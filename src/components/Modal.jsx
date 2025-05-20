const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div
            className="dark:bg-gray-800 bg-gray-200 p-6 rounded-lg text-right w-full max-w-lg mx-4 z-10 max-h-[80vh] overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db black',
            }}
          >
            <button
              className="dark:text-white text-black font-semibold dark:hover:text-gray-200 hover:text-gray-700 focus:outline-none mr-2"
              onClick={onClose}
            >
              X
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
