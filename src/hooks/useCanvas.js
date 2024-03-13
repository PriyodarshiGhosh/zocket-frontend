import { useEffect } from 'react';

const useCanvas = (templateData, backgroundColor, selectedImage, designPattern, mask, maskStroke, canvasRef) => {
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
    // Draw CTA
    ctx.font = `${templateData.cta.font_size || 30}px Arial`;
    ctx.fillStyle = templateData.caption.text_color; // Use caption text color
    ctx.textAlign = templateData.caption.alignment; // Use caption alignment
    const ctaLines = getLines(ctx, templateData.cta.text, templateData.cta.max_characters_per_line);
    ctaLines.forEach((line, index) => {
    ctx.fillText(line, templateData.cta.position.x, templateData.cta.position.y + (index * templateData.cta.font_size));
   });

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
};

export default useCanvas;
