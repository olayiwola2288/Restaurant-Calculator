import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Olalere",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "A'isah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Adenike",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="lg:flex flex-col min-h-screen items-center justify-between">
      <div className="lg:flex gap-48 App lg:flex-row md:flex-row flex-1 w-full max-w-screen-lg">
        <div className="sidebar">
          <FriendList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelection={handleSelection}
          />

          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

          <Button  onClick={handleShowAddFriend} className="text-orange-800">
            {showAddFriend ? "close" : "Add friend"}
          </Button>
        </div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          />
        )}
        
      </div>
      <Footer />
      </div>
      

  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <div>
      <h1 className="text-center font-bold text-6xl py-10 bg-[#fff4e6] rounded ">
        Eat-And-SPLIT
      </h1>
      <ul>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            selectedFriend={selectedFriend}
            onSelection={onSelection}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend && selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}£
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}£
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏾‍🤝‍👩🏼 Friend name</label>
      <input
        type="text"
        placeholder="Enter your friend name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
      
    </form>

  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [WhoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByFriend) return;
    onSplitBill(WhoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill mt-28" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="number"
        placeholder="Enter total bill"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️ Your bill</label>
      <input
        type="number"
        placeholder="Enter your bill"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👩🏾‍🤝‍👩🏼 {selectedFriend.name}'s expense</label>
      <input type="number" disabled value={paidByFriend} />

      <label>🤑 who is paying the bill</label>
      <select
        value={WhoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}
function Footer() {
  return (
    <div className="mx-10 rounded bg-red-50 my-10 text-3xl">
      <marquee behavior="scroll" direction="left" scrollamount="5">
        In a world where sharing meals and experiences is a cherished tradition,
        managing shared expenses can sometimes be a hassle. Enter
        "Eat-And-SPLIT," a user-friendly and intuitive web application designed
        to simplify the process of splitting bills and keeping track of shared
        expenses among friends.{" "}
      </marquee>
    </div>
  );
}
