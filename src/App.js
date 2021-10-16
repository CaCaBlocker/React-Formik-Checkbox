import "./styles.css";
import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";

import { taxData } from "./json";

export default function App() {
  const [dataArray, setDataArr] = useState([]);

  useEffect(() => {
    setDataArr(taxData);
  }, []);

  const categoriedData = {};
  for (let i = 0; i < dataArray.length; i++) {
    let category = " ";
    if (dataArray[i].category) {
      category = dataArray[i].category.name;
    }
    if (!categoriedData[category]) {
      categoriedData[category] = [];
    }
    categoriedData[category].push({
      id: dataArray[i].id,
      name: dataArray[i].name
    });
  }
  const categories = Object.keys(categoriedData);
  let initialCategoryValues = [];
  categories.map((category) => (initialCategoryValues[category] = []));
  return (
    <div>
      <h1>Add Tax</h1>
      <Formik
        initialValues={{
          rate: 0,
          applied_to: "",
          checked: [],
          name: "",
          ...initialCategoryValues
        }}
        onSubmit={(values) => {
          let items = [];
          const { applied_to, name, rate } = values;
          for (const category of categories) {
            for (const item of values[category]) {
              items.push(Number(item.split("-")[1]));
            }
          }
          alert(
            JSON.stringify(
              {
                applied_items: items,
                applied_to,
                name,
                rate: Number(rate / 100).toFixed(2)
              },
              null,
              2
            )
          );
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div>
              <Field name="name" placeholder="" type="text" />
              <Field name="rate" placeholder="%" type="text" />
            </div>
            <div>
              <label>
                <Field
                  type="radio"
                  name="applied_to"
                  value="all"
                  onChange={(e) => {
                    setFieldValue("applied_to", "all");
                    setFieldValue("checked", [...categories]);

                    categories.map((category) => {
                      let temp = categoriedData[category].map(
                        (item) => category + "-" + item.id
                      );
                      setFieldValue(category, temp);
                    });
                  }}
                />
                Apply to all items in collection
              </label>
              <label>
                <Field
                  type="radio"
                  name="applied_to"
                  value="some"
                  onChange={(e) => {
                    setFieldValue("applied_to", "some");
                    setFieldValue("checked", []);

                    categories.map((category) => {
                      setFieldValue(category, []);
                    });
                  }}
                />
                Apply to specific items
              </label>
            </div>
            {categories.map((category, index) => (
              <div key={"cate" + index}>
                <label>
                  <Field
                    type="checkbox"
                    name="checked"
                    value={category}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFieldValue("checked", [
                          ...values["checked"],
                          category
                        ]);
                        let temp = categoriedData[category].map(
                          (item) => category + "-" + item.id
                        );
                        setFieldValue(category, temp);
                      } else {
                        let temp = values["checked"];
                        const index = temp.indexOf(category);
                        if (index > -1) {
                          temp.splice(index, 1);
                        }
                        setFieldValue("checked", temp);
                        setFieldValue(category, []);
                      }
                    }}
                  />
                  {category}
                </label>
                {categoriedData[category].map((item, index) => (
                  <div style={{ marginLeft: "10px" }} key={"sub" + index}>
                    <label>
                      <Field
                        type="checkbox"
                        name={category}
                        value={category + "-" + item.id}
                      />
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button
              type="submit"
              style={{ marginTop: "20px", padding: "10px" }}
            >
              Apply tax to{" "}
              {categories.length > 0 &&
                categories
                  .map((category) =>
                    values[category] ? values[category].length : 0
                  )
                  .reduce((prev, next) => prev + next)}{" "}
              items
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
