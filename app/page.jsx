'use client'

import { Carousel } from "@mantine/carousel";
import { Center, Group, Paper, Stack, Switch, Text } from "@mantine/core";
import { Icon123, IconInfinity } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

// Normal map for numbers to letters (A-Z)
const normalMap = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// Unicode map with 130 characters, including control characters and visible ones
const unicodeMap = Array.from({ length: 130 }, (_, i) => ({
  code: i,
  name:
    i === 0 ? "NUL (Null)" :                      // NUL: Null
    i === 1 ? "SOH (Start of Heading)" :           // SOH: Start of Heading
    i === 2 ? "STX (Start of Text)" :              // STX: Start of Text
    i === 3 ? "ETX (End of Text)" :                // ETX: End of Text
    i === 4 ? "EOT (End of Transmission)" :        // EOT: End of Transmission
    i === 5 ? "ENQ (Enquiry)" :                    // ENQ: Enquiry
    i === 6 ? "ACK (Acknowledge)" :                // ACK: Acknowledge
    i === 7 ? "BEL (Bell)" :                       // BEL: Bell
    i === 8 ? "BS (Backspace)" :                   // BS: Backspace
    i === 9 ? "TAB (Horizontal Tab)" :             // TAB: Horizontal Tab
    i === 10 ? "LF (Line Feed)" :                  // LF: Line Feed
    i === 11 ? "VT (Vertical Tab)" :               // VT: Vertical Tab
    i === 12 ? "FF (Form Feed)" :                  // FF: Form Feed
    i === 13 ? "CR (Carriage Return)" :            // CR: Carriage Return
    i === 14 ? "SO (Shift Out)" :                  // SO: Shift Out
    i === 15 ? "SI (Shift In)" :                   // SI: Shift In
    i === 16 ? "DLE (Data Link Escape)" :          // DLE: Data Link Escape
    i === 17 ? "DC1 (Device Control 1)" :          // DC1: Device Control 1
    i === 18 ? "DC2 (Device Control 2)" :          // DC2: Device Control 2
    i === 19 ? "DC3 (Device Control 3)" :          // DC3: Device Control 3
    i === 20 ? "DC4 (Device Control 4)" :          // DC4: Device Control 4
    i === 21 ? "NAK (Negative Acknowledge)" :      // NAK: Negative Acknowledge
    i === 22 ? "SYN (Synchronous Idle)" :          // SYN: Synchronous Idle
    i === 23 ? "ETB (End of Transmission Block)" : // ETB: End of Transmission Block
    i === 24 ? "CAN (Cancel)" :                    // CAN: Cancel
    i === 25 ? "EM (End of Medium)" :              // EM: End of Medium
    i === 26 ? "SUB (Substitute)" :                // SUB: Substitute
    i === 27 ? "ESC (Escape)" :                    // ESC: Escape
    i === 28 ? "FS (File Separator)" :             // FS: File Separator
    i === 29 ? "GS (Group Separator)" :            // GS: Group Separator
    i === 30 ? "RS (Record Separator)" :           // RS: Record Separator
    i === 31 ? "US (Unit Separator)" :             // US: Unit Separator
    i === 32 ? "SPACE" :                           // Space (no description needed)
    i === 127 ? "DEL (Delete)" :                   // DEL: Delete
    i >= 33 && i <= 130 ? String.fromCharCode(i) : `U+${i.toString(16).toUpperCase()}`
}));


// Function to map Unicode characters based on the index
const getUnicodeChar = (index) => {
  const item = unicodeMap.find((item) => item.code === index);
  return item ? item.name : String.fromCharCode(index);
};

export default function HomePage() {
  const [unicode, setUnicode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // To track the active slide
  const emblaRef = useRef(null); // Reference to the embla API
  const isHolding = useRef(false); // To track whether a key is being held down

  // Function to calculate the opacity of a slide based on its distance from the active slide
  const calculateOpacity = (slideIndex) => {
    const distanceFromActive = Math.abs(activeIndex - slideIndex);
    if (distanceFromActive > 5) return 0; // Slides that are too far away will be completely transparent
    return 1 - (distanceFromActive / 5); // Opacity decreases as the distance increases
  };

  // Function to dynamically calculate the border opacity for the active slide
  const calculateBorderOpacity = (slideIndex) => {
    const opacity = Math.pow(calculateOpacity(slideIndex), 3);
    return `rgba(69, 137, 223, ${opacity})`; // Blue border with opacity based on the distance
  };

  // Function to move the carousel up or down
  const moveCarousel = (direction) => {
    if (!emblaRef.current) return;
    if (direction === 'down' && activeIndex < (unicode ? 130 : 26) - 1) {
      emblaRef.current.scrollNext(); // Scroll down
    } else if (direction === 'up' && activeIndex > 0) {
      emblaRef.current.scrollPrev(); // Scroll up
    }
  };

  // Handle keydown and keyup events
  const handleKeyDown = (event) => {
    if (isHolding.current) return; // Ignore if already holding the key
    if (event.key === 'ArrowDown') {
      isHolding.current = true;
      moveCarousel('down');
    } else if (event.key === 'ArrowUp') {
      isHolding.current = true;
      moveCarousel('up');
    }
  };

  const handleKeyUp = () => {
    isHolding.current = false; // Reset hold status when key is released
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeIndex]);

  return (
    <Stack p="xl" h="100vh">
      <Group justify="center">
        <Switch
          checked={unicode}
          onChange={(event) => setUnicode(event.currentTarget.checked)}
          size="xl"
          offLabel={<Icon123 />}
          onLabel={<IconInfinity />}
        />
      </Group>

      <Group justify="center">
        <Carousel
          height="90vh"
          w="100vw"
          withControls
          orientation="vertical"
          slideSize="10%"
          dragFree
          getEmblaApi={(embla) => (emblaRef.current = embla)} // Get access to the embla API
          onSlideChange={setActiveIndex} // Track the active slide index
        >
          {
            Array(unicode ? 130 : 26).fill(0).map((_, i) => (
              <Carousel.Slide
                key={i}
                style={{
                  opacity: Math.pow(calculateOpacity(i), 2), // Dynamically calculate the opacity
                  scale: 1 + Math.pow(calculateOpacity(i), 1) * 0.2,
                  transition: 'all 0.3s ease', // Smooth transition for the fade effect
                }}
              >
                <Center h="100%" px={5}>
                  <NumToTextMap num={i} unicode={unicode} />
                </Center>
              </Carousel.Slide>
            ))
          }
        </Carousel>
      </Group>
    </Stack>
  );
}

// Split the main character and description (if available)
function parseUnicodeChar(name) {
  const [main, description] = name.split(' (');
  return {
    main: main.trim(),
    description: description ? description.replace(')', '').trim() : null,
  };
}

function NumToTextMap({ num, unicode = false }) {
  const { main, description } = parseUnicodeChar(unicode ? getUnicodeChar(num) : normalMap[num]);

  return (
    <Paper py="sm" px="lg" withBorder w="90vw" maw={350}>
      <Group justify="space-between">
        <Text fz={27} style={{ fontFamily: "Source Code Pro" }}>{num}</Text>
        <Group gap="md">
          {description && <Text fz={14} style={{ fontFamily: "Meta Serif Pro", color: "#888" }}>{description}</Text>}
          <Text fz={23} style={{ fontFamily: "Source Code Pro" }}>{main}</Text>
        </Group>
      </Group>
    </Paper>
  );
}
