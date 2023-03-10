import React, { useEffect, useState } from "react";
import ViewRow from "../components/ViewRow";
import ReactLoading from "react-loading";
import Form from "react-bootstrap/Form";

import "../css/RecruiterView.css";
import axios from "axios";

function RecruiterView() {
  const [data, setData] = useState([]);
  const [display, setDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("firstName");

  const handleChange = (event) => {
    const map = {
      All: "all",
      "First Name": "firstName",
      "Last Name": "lastName",
      Degree: "degree",
      Skills: "skills",
    };

    console.log(map[event.target.value]);
    setFilter(map[event.target.value]);
  };

  const searchChange = (event) => {
    let string = event.target.value.toLowerCase();
    string = string.replace(/\+/g, "\\+");
    // string.replace("+", `\+`);
    const search = new RegExp("^" + string + ".*");

    // if (filter === "all") {
    //   let matched = []
    //   for (let i = 0; i < data.length; i++) {
    //     const keys = Object.keys(data[i]);
    //     for (const key in keys) {
    //       if(Array.isArray(data[key])){
    //         for(let j = 0; j < data[key].length; j++){
    //           if()
    //         }
    //       }
    //     }
    //   }
    // }
    if (filter === "skills") {
      let matched = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].skills.length; j++) {
          if (data[i].skills[j].toLowerCase().match(search)) {
            matched.push(data[i]);
            break;
          }
        }
      }
      setDisplay(matched);
    } else if (filter === "degree") {
      // const search = new RegExp(event.target.value + ".*");
    } else {
      const matched = data.filter((item) =>
        item[filter].toLowerCase().match(search)
      );
      setDisplay(matched);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios.get("http://localhost:3001/getResumes").then((response) => {
        const arr = response.data.sort((a, b) =>
          a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase())
        );

        console.log(arr);

        setData(arr);
        setDisplay(arr);

        setLoading(false);
      });

      // await fetch("http://localhost:3001/getResumes", {
      //   method: "get",
      // })
      //   .then((res) => res.json())
      //   .then((itemData) => {
      //     setData(
      //       itemData.sort((a, b) =>
      //         a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase())
      //       )
      //     );
      //     console.log(itemData);
      //     setTimeout(() => {
      //       setLoading(false);
      //     }, 1000);
      //     // setLoading(false);
      //   });
    };
    fetchData();
  }, []);

  return (
    <div className="RecruiterView">
      <div className="RecruiterFilter">
        <Form.Select className="RecruiterSelect" onChange={handleChange}>
          {/* <option>All</option> */}
          <option>First Name</option>
          <option>Last Name</option>
          <option>Skills</option>
          {/* <option>Degree</option> */}
        </Form.Select>

        <Form.Group className="RecruiterSearch">
          <Form.Control
            type="email"
            placeholder={`Search ${filter}`}
            onChange={searchChange}
          />
        </Form.Group>
      </div>

      {loading ? (
        <ReactLoading
          className="RecruiterLoading"
          type={"bars"}
          color="blue"
          width={"25%"}
          height={"20%"}
        ></ReactLoading>
      ) : (
        <>
          <div className="ViewFilter">
            <ViewRow
              row={{
                isFilter: true,
              }}
            />
          </div>
          <div className="ViewData">
            {display?.map((item, index) => {
              return <ViewRow key={item._id} row={item} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default RecruiterView;
