import { Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { showDeleteModal } from "../redux/user/userSlice";
import DeleteUserModal from "./DeleteUserModal";
import Prompt from "./Prompt";

export default function UsersTable() {
  const [allUsers, setAllUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const { currentUser, showModal } = useSelector((state) => state.user);
  const { prompt, promptText } = useSelector((state) => state.counterarg);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/getallusers");
        const data = await res.json();
        if (res.ok) {
          setAllUsers(data);
          setLoading(false);
          if (data.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchAllUsers();
  }, [showModal]);

  const handleShowMore = async () => {
    const startIndex = allUsers.length;
    try {
      const res = await fetch(
        `/api/admin/getallusers?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setAllUsers((prev) => [...prev, ...data]);
        if (data.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
      {currentUser.isAdmin && allUsers.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head className="text-center text-cblack">
              <Table.HeadCell className="bg-clight">
                Date Created
              </Table.HeadCell>
              <Table.HeadCell className="bg-clight">
                Profile Picture
              </Table.HeadCell>
              <Table.HeadCell className="bg-clight">Username</Table.HeadCell>
              <Table.HeadCell className="bg-clight">Email</Table.HeadCell>
              <Table.HeadCell className="bg-clight">
                Total Counterarguments
              </Table.HeadCell>
              <Table.HeadCell className="bg-clight">
                Total Topics
              </Table.HeadCell>
              <Table.HeadCell className="bg-clight"></Table.HeadCell>
            </Table.Head>
            {allUsers.map((user, index) => (
              <Table.Body className="divide-y" key={index}>
                <Table.Row className="bg-clight text-center text-cblack hover:bg-gray-200">
                  <Table.Cell>
                    {new Date(user.dateCreated).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePic}
                      className="size-10 object-cover rounded-full m-auto"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.totalCounterargs}</Table.Cell>
                  <Table.Cell>{user.totalTopics}</Table.Cell>
                  <Table.Cell>
                    <MdDelete
                      className="size-5 font-medium text-red-400 cursor-pointer hover:text-red-500"
                      onClick={() => {
                        setUserToDelete(user.userId);
                        dispatch(showDeleteModal());
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-cbrown underline self-center text-sm py-3"
            >
              Show more
            </button>
          )}
        </>
      ) : loading ? (
        <Spinner className="w-full h-14 fill-cgreen" />
      ) : (
        <p>No users yet!</p>
      )}
      <DeleteUserModal userToDelete={userToDelete} />
      {prompt && promptText && <Prompt promptText={promptText} />}
    </div>
  );
}
