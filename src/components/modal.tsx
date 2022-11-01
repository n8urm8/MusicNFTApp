import { useState } from "react"

interface ModalProps {
  children: React.ReactNode
  openButtonText: string
  header: string
}

export const Modal: React.FC<ModalProps> = ({ children, openButtonText, header }) => {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      <button type='button' className="primary w-full" onClick={() => setShowModal(true)}>{openButtonText}</button>
      {showModal ?
       <>
          <div
            className="justify-center items-center flex  fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-1 mx-auto">
              {/*content*/}
              <div className="border-0 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-4 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {header}
                  </h3>
                  <button
                    className="text-black opacity-10 float-right text-3xl font-semibold -mt-4"
                    onClick={() => setShowModal(false)}
                  > x </button>
                </div>
                {/*body*/}
                <div className="relative p-4 flex-auto">
                  {children}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
        : null
      }
    </>
  )
}