import { useState } from "react";
import CreateGroupModal from "../CreateGroupModal.tsx";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

function NewGroup() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  return (
    <div>
      <button
        className="w-44 flex items-center gap-3 px-4 py-2 hover:bg-gray-50 hover:text-black hover:rounded-xl cursor-pointer"
        onClick={() => setShowCreateGroup(true)}
        // onClick={() => setShowDropdown(false)}
      >
        <GroupAddIcon fontSize="small"/>
        <span>New Group</span>
        {showCreateGroup && (
          <CreateGroupModal onClose={() => setShowCreateGroup(false)}/>
        )}
      </button>
    </div>
  );
}

export default NewGroup;
