import { FloatingBtn } from "@/components/FloatingBtn"
import { ListNotes } from "@/components/ListNotes"
import { SideBar } from "@/components/SideBar"


export const Dashboard = () => {
  return (
    <div className="bg-primary text-white relative">
      <SideBar/>
      <div className="ml-[250px] p-20 overflow-x-hidden">
        <div className="bg-white bg-opacity-30 border-dotted border-2 border-black w-[600px] h-[100px] flex justify-center items-center hover:opacity-60 hover:border-4 relative rounded-3xl m-auto">
          <i className="fa-regular fa-plus text-4xl"></i>
          <p className="absolute w-full text-6xl  opacity-5 text-center">New Notes</p>
        </div>
        <div className="mt-16">
          <ListNotes title={"Recent Notes"}/>
          <ListNotes title={"All Notes"}/>
        </div>
        <FloatingBtn/>
      </div>
      
    </div>
  )
}
