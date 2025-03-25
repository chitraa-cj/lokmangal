const generateMainNewsData = (count) => {
  const titles = ["लोरेम इप्सुम डोलर सिट अमेट, कॉन्सेक्टुर एडिपिसिंग एलिट"];

  const conclusions = [
    "लोरेम इप्सम डोलर सिट अमेट, कंसेक्टेचर एडिपिसिंग एलीट। डोनेक वेल सेपियन नॉन वेलिट सॉलिसिटुडिन टेम्पस। इंटीजर यूइस्मोड, ननक एगेट कॉन्वेलिस बिबेंडम, लिगुला एराट डिक्टम पुरस, नेक टिनसीडंट टॉर्टर उरना सिट अमेट इरोस।",
  ];

  const content = [
    "<p>लोरेम इप्सम डोलर सिट अमेट, कंसेक्टेचर एडिपिसिंग एलीट। डोनेक वेल सेपियन नॉन वेलिट सॉलिसिटुडिन टेम्पस। इंटीजर यूइस्मोड, नंक एगेट कॉन्वेलिस बिबेंडम, लिगुला एराट डिक्टम पुरस, एनईसी टिनसीडंट टॉर्टर उरना सिट अमेट इरोस।</p> <p>सस्पेंडिस पोटेंटी। विवामस नॉन टर्पिस ए फेलिस वेहिकुला फेरमेंटम। क्रैस बिबेंडम डोलोर एसी एमआई कमोडो, एट इंटरडम एलीट ससिपिट। नाम कॉनसेक्वेट निसी नेक लोरेम ट्रिस्टिक, इन फ्यूगिएट फेलिस टेम्पस।</p> <p>वेस्टिबुलम डिक्टम क्वाम आईडी लिगुला प्लेसरैट, एसी फॉसीबस पुरस मोलेस्टी। फ़्यूसे यूइस्मोड लिगुला वेल टेलस सैगिटिस, वेल वेहिकुला लिबरो एलिकेट। नल्लम नेक ओरसी सिट अमेट लिगुला डेपिबस पोसुएरे।</p> <p>क्यूराबिटूर वाहन ओरसी आईडी लिबरो फ्यूगियाट, वेल पोसुएरे लिबरो हेंड्रेरिट। फेसेलस फ्रिंजिला क्वाम और निसी वेहिकुला, सिट अमेट डिग्निसिम पुरस ग्रेविडा। इन एचएसी हैबिटास प्लैटिया डिक्टमस्ट।</p> <p>मोरबी एसी लेक्टस ईयू एमआई ऑक्टर मालेसुआडा। एलिक्वम एराट वॉलुटपैट. एनियन सैगिटिस मस्सा इन निस्ल फ्रिंजिला, ईयू वल्पुटेट इरोस टिनसिडंट।</p> <p>क्विस्क नेक जस्टो यूट ओरसी फ्यूगिएट टिनसिडंट। वेलिट डैपिबस में प्रेजेंट मोलिस मेटस, एक वेरियस लिबरो वेरियस। इंटीजर वल्पुटेट फेलिस आईडी एराट फेरेट्रा, ए फैसिलिसिस जस्टो इंटरडम।</p>",
  ];

  // const imgUrl = "https://picsum.photos/700/384";
  const imgUrl = "/image.jpg";

  const navbarCategories = [
    "देश",
    "दुनिया",
    "प्रदेशक खबरे",
    "राजनीति",
    "अप्राध",
    "खेल",
    "हमारा शहर",
    "वीडियो",
    "मनोरंजन",
  ];

  const hashtags = [
    "ब्रेकिंगन्यूज़",
    "स्थानीयन्यूज़",
    "टेकट्रेंड्स",
    "स्वास्थ्यअद्यतन",
    "खेलहाइलाइट्स",
    "समुदाय",
    "अर्थव्यवस्था",
    "संस्कृति",
    "शिक्षा",
    "यात्रा",
  ];

  const footerTags = [
    "Bollywood News",
    "TV Serials",
    "Hollywood News",
    "Movie Reviews",
    "Health News",
    "Fitness News",
    "Fashion News",
    "Spirituality",
    "Madhya Pradesh News",
    "Uttar Pradesh News",
    "Rajasthan News",
    "Haryana News",
    "Bihar News",
  ];

  const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // return Array.from({ length: count }, (_, index) => ({
  //   title: titles[index % titles.length], // Rotating through titles
  //   conclusion: conclusions[index % conclusions.length], // Rotating through conclusions
  //   imgUrl: imgUrl, // Static image URL
  //   content: content[index % content.length], // Rotating through content
  //   navbarCategories: getRandomItems(navbarCategories, 3), // Random 3 categories
  //   hashtags: getRandomItems(hashtags, Math.floor(Math.random() * 3) + 1),
  //   footerTags: getRandomItems(footerTags, 3), // Random 3 footer tags
  // }));

  return Array.from({ length: count }, (_, index) => ({
    title: titles[index % titles.length],
    conclusion: conclusions[index % conclusions.length],
    imgUrl: imgUrl,
    content: content[index % content.length],
    // Only include these fields for 'main' news; they'll be overridden as empty arrays for others
    navbarCategories: getRandomItems(navbarCategories, 3),
    hashtags: getRandomItems(hashtags, Math.floor(Math.random() * 3) + 1),
    footerTags: getRandomItems(footerTags, 3),
  }));
};

export default generateMainNewsData;
