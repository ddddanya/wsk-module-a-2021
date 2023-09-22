import { useEffect, useState } from "react";
import openFullscreen from "./utils/openFullScreen";

function App() {
  const [table, setTable] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("table")) {
      setTable(JSON.parse(localStorage.getItem("table")));
    } else {
      setTable([
        ["Samat", "Arman", "Marat", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]);
    }
  }, []);

  useEffect(() => {
    for (let i in table) {
      for (let j in table[i]) {
        const id = `item-${i}-${j}`;

        document.querySelector(`#${id}`).addEventListener(`dragstart`, (e) => {
          e.target.classList.add(`selected`);
        });
        document.querySelector(`#${id}`).addEventListener(`dragend`, (e) => {
          e.preventDefault();
          e.target.classList.remove(`selected`);
        });
        document.querySelector(`#${id}`).addEventListener(`dragover`, (e) => {
          e.preventDefault();
          const tasksListElement = document.querySelector(`table`);

          const activeElement = tasksListElement.querySelector(`.selected`);
          const currentElement = e.target;
          const isMoveable = activeElement !== currentElement;

          if (!isMoveable) {
            return;
          }

          const nextElement =
            currentElement === activeElement.nextElementSibling
              ? currentElement.nextElementSibling
              : currentElement;

          let newTable = table;
          const active =
            newTable[activeElement.id.split("-")[1]][
              activeElement.id.split("-")[2]
            ];
          const next =
            newTable[nextElement.id.split("-")[1]][
              nextElement.id.split("-")[2]
            ];

          newTable[activeElement.id.split("-")[1]][
            activeElement.id.split("-")[2]
          ] = next;
          newTable[nextElement.id.split("-")[1]][nextElement.id.split("-")[2]] =
            active;
          setTable([...newTable]);
        });
      }
    }
  }, [table]);

  useEffect(() => {
    if (table.length) {
      localStorage.setItem("table", JSON.stringify(table));
    }
  }, [table]);

  return (
    <div className="App">
      <header>
        <div className="title">VIP List</div>

        <div className="buttons">
          <input
            type="file"
            hidden
            id="upload"
            onChange={(e) => {
              console.log(document.querySelector("#upload").files);
              const reader = new FileReader();

              reader.readAsText(
                document.querySelector("#upload").files[0],
                "UTF-8"
              );

              reader.onload = (e) => {
                const result = e.target.result.replaceAll("\r", "").split("\n");
                const newTable = [[], [], [], []];
                for (let i in result) {
                  if (result[i].startsWith("-")) {
                    console.log(result[i]);
                    if (Number(i) < 2) continue;

                    const row =
                      Number(i) <= 9
                        ? 0
                        : Number(i) <= 17
                        ? 1
                        : Number(i) <= 25
                        ? 2
                        : 3;
                    console.log(row, result[i]);
                    newTable[row].push(
                      result[i].replace("-", "").replace(" ", "")
                    );
                  }
                }

                console.log(newTable);
                setTable([...newTable]);
              };

              reader.onerror = (e) => {
                alert("Произошла ошибка");
              };
            }}
          />
          <div
            className="item"
            onClick={() => {
              document.querySelector("#upload").click();
            }}
          >
            Import
          </div>
          <div
            className="item"
            onClick={() => {
              let content = "# VIP List\n\n";

              for (let i in table) {
                for (let j in table[i]) {
                  console.log(i, j, table[i][j]);
                  content += `- ${table[i][j]}`;
                  if (
                    Number(i) == table.length &&
                    Number(j) == table[i].length
                  ) {
                  } else {
                    content += "\n";
                  }
                }
              }

              const el = document.createElement("a");

              el.setAttribute(
                "href",
                `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
              );
              el.setAttribute("download", "viplist.txt");

              el.style.display = "none";
              document.body.appendChild(el);

              el.click();

              document.body.removeChild(el);

              console.log(content);
            }}
          >
            Export
          </div>

          <div
            className="item"
            onClick={() => {
              let content = "# VIP List\n\n";

              for (let i in table) {
                for (let j in table[i]) {
                  console.log(i, j, table[i][j]);
                  content += `- ${table[i][j]}`;
                  if (
                    Number(i) == table.length &&
                    Number(j) == table[i].length
                  ) {
                  } else {
                    content += "\n";
                  }
                }
              }

              window.navigator.clipboard.writeText(content);

              alert("Copied!");
            }}
          >
            Copy to clipboard
          </div>
        </div>
      </header>

      <div className="button" onClick={openFullscreen}>
        Full Screen
      </div>

      <table>
        <tbody>
          {table.map((row, rowIndex) => {
            return (
              <tr>
                {row.map((item, itemIndex) => {
                  console.log(item);
                  return (
                    <td>
                      <input
                        id={`item-${rowIndex}-${itemIndex}`}
                        onChange={(e) => {
                          let newTable = table;
                          newTable[rowIndex][itemIndex] = e.target.value;
                          console.log(newTable);
                          setTable([...newTable]);
                        }}
                        value={item}
                        draggable
                      ></input>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
