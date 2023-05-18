import * as React from "react";

const OB_KEYWORD_KEY = 'ob_keyowrd_key'

export default function KeywordView({insert}): JSX.Element {
  const [value, setValue] = React.useState('');
  const [keywords, setKeywords] = React.useState([]);
  React.useEffect(() => {
    const store = localStorage.getItem(OB_KEYWORD_KEY);
    if (!store) {
      return;
    }
    let result = [];
    try {
      result = JSON.parse(store);
    } catch(e) {};
    setKeywords(result);
  }, [])

  const appendHandler = () => {
    const word = value?.trim();
    if (!word || word.length === 0) {
      return;
    }
    const newKeywords = [...keywords, word]
    setKeywords(newKeywords);
    setValue('');
    localStorage.setItem(OB_KEYWORD_KEY, JSON.stringify(newKeywords));
  }

  return (
    <>
      <div className="DiceRoller__container">
        <input
          style={{
            width: '50%'
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={e => {
            if (e.keyCode === 13) {
              appendHandler();
            }
          }}
        />
        <button onClick={() => {
          appendHandler();
        }}>确定</button>
      </div>
      <ul style={{paddingInlineStart: 20, marginBlockStart: 0}}>
        {keywords.map((item, index) => {
          return <li key={item} style={{margin: '5px 0 5px 0'}}>
            <button onClick={() => {
              insert(item);
            }}>{item}</button> &nbsp;
            <button onClick={() => {
              keywords.splice(index, 1);
              setKeywords(keywords.concat());
              localStorage.setItem(OB_KEYWORD_KEY, JSON.stringify(keywords));
            }}>&#10060;</button>
          </li>
        })}
      </ul>
      
      {/* <button onClick={() => {
          insert('xxxx');
        }}>
        Insert Test
      </button> */}
    </>
  );
}
