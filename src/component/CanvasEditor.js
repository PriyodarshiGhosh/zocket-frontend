import React, { useState, useRef, useEffect, useMemo } from 'react';

const CanvasEditor = () => {
  const [templateData, setTemplateData] = useState({
    caption: {
      text: "         ",
      position: { x: 50, y: 50 },
      max_characters_per_line: 31,
      font_size: 35,
      alignment: "left",
      text_color: "#FFFFFF"
    },
    cta: {
      text: "Shop Now",
      position: { x: 190, y: 320 },
      text_color: "#FFFFFF",
      background_color: "#FFFFFF"
    },
    image_mask: { x: 56, y: 442, width: 970, height: 600 },
    urls: {
      mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
      stroke: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
      design_pattern: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png"
    }
  });
  const [captionInput, setCaptionInput] = useState('');
  const [ctaInput, setCtaInput] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#0369A1');
  const [selectedImage, setSelectedImage] = useState(null);
  const [recentColors, setRecentColors] = useState([]);
  const canvasRef = useRef(null);

  const designPattern = useMemo(() => {
    const image = new Image();
    image.src = templateData.urls.design_pattern;
    return image;
  }, [templateData.urls.design_pattern]);

  const mask = useMemo(() => {
    const image = new Image();
    image.src = templateData.urls.mask;
    return image;
  }, [templateData.urls.mask]);

  const maskStroke = useMemo(() => {
    const image = new Image();
    image.src = templateData.urls.stroke;
    return image;
  }, [templateData.urls.stroke]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load design pattern
    designPattern.onload = () => {
      ctx.drawImage(designPattern, 0, 0, canvas.width, canvas.height);
    };

    // Load mask
    mask.onload = () => {
      ctx.drawImage(mask, templateData.image_mask.x, templateData.image_mask.y, templateData.image_mask.width, templateData.image_mask.height);
    };

    // Load mask stroke
    maskStroke.onload = () => {
      ctx.drawImage(maskStroke, templateData.image_mask.x, templateData.image_mask.y, templateData.image_mask.width, templateData.image_mask.height);
    };

    // Draw selected image
    if (selectedImage) {
      ctx.drawImage(selectedImage, templateData.image_mask.x, templateData.image_mask.y, templateData.image_mask.width, templateData.image_mask.height);
    }

    // Draw caption
    ctx.font = `${templateData.caption.font_size}px Arial`;
    ctx.fillStyle = templateData.caption.text_color;
    ctx.textAlign = templateData.caption.alignment;
    const lines = getLines(ctx, templateData.caption.text, templateData.caption.max_characters_per_line);
    lines.forEach((line, index) => {
      ctx.fillText(line, templateData.caption.position.x, templateData.caption.position.y + (index * templateData.caption.font_size));
    });

    // Draw CTA
    ctx.font = `${templateData.cta.font_size || 30}px Arial`;
    ctx.fillStyle = templateData.cta.text_color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = templateData.cta.background_color;
    ctx.fillRect(
      templateData.cta.position.x - 24,
      templateData.cta.position.y - templateData.cta.font_size - 12,
      ctx.measureText(templateData.cta.text).width + 48,
      templateData.cta.font_size + 24
    );
    ctx.fillText(templateData.cta.text, templateData.cta.position.x, templateData.cta.position.y);

  }, [templateData, backgroundColor, selectedImage, designPattern, mask, maskStroke]);

  const getLines = (ctx, text, maxCharactersPerLine) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(`${currentLine} ${word}`).width;
      if (width < maxCharactersPerLine * ctx.measureText('A').width) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const handleCaptionChange = (e) => {
    setCaptionInput(e.target.value);
    setTemplateData(prevData => ({
      ...prevData,
      caption: {
        ...prevData.caption,
        text: e.target.value
      }
    }));
  };

  const handleCtaChange = (e) => {
    setCtaInput(e.target.value);
    setTemplateData(prevData => ({
      ...prevData,
      cta: {
        ...prevData.cta,
        text: e.target.value
      }
    }));
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
    if (!recentColors.includes(color)) {
      setRecentColors(prevColors => {
        const updatedColors = [...prevColors, color];
        return updatedColors.slice(-5); // keep only the last 5 colors
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;
        image.onload = () => {
          setSelectedImage(image);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSelect = (color) => {
    setBackgroundColor(color);
    if (!recentColors.includes(color)) {
      setRecentColors(prevColors => {
        const updatedColors = [...prevColors, color];
        return updatedColors.slice(-5); // keep only the last 5 colors
      });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      <canvas ref={canvasRef} width={1080} height={1080} />
      <div className="flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2">AdCustomization</h3>
          <p className="text-sm text-gray-600 mb-4">Customize your ad and get the templates accordingly</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            <hr className="flex-grow border-gray-300" />
            <div className="mx-4 text-sm font-medium text-gray-700">Edit Contents</div>
            <hr className="flex-grow border-gray-300" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Caption:</label>
          <input type="text" value={captionInput} onChange={handleCaptionChange} className="border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">CTA:</label>
          <input type="text" value={ctaInput} onChange={handleCtaChange} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Background Color:</label>
          <input type="color" value={backgroundColor} onChange={(e) => handleBackgroundColorChange(e.target.value)} className="border border-gray-300 rounded-md p-2" />
          {recentColors.map(color => (
            <div
              key={color}
              style={{ backgroundColor: color, width: '20px', height: '20px', display: 'inline-block', cursor: 'pointer', margin: '2px', border: '1px solid #ccc', borderRadius: '50%' }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
