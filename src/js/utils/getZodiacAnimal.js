// Function to determine if a date is before the Chinese New Year for the given year
const chineseNewYearDates = {
    1900: [1, 30], 1901: [2, 18], 1902: [2, 8], 1903: [1, 28], 1904: [2, 16],
    1905: [2, 4], 1906: [1, 24], 1907: [2, 12], 1908: [2, 2], 1909: [1, 21],
    1910: [2, 9], 1911: [1, 30], 1912: [2, 17], 1913: [2, 5], 1914: [1, 25],
    1915: [2, 13], 1916: [2, 3], 1917: [1, 22], 1918: [2, 11], 1919: [1, 31],
    1920: [2, 19], 1921: [2, 7], 1922: [1, 27], 1923: [2, 15], 1924: [2, 4],
    1925: [1, 24], 1926: [2, 12], 1927: [2, 2], 1928: [1, 22], 1929: [2, 9],
    1930: [1, 29], 1931: [2, 17], 1932: [2, 6], 1933: [1, 25], 1934: [2, 13],
    1935: [2, 3], 1936: [1, 23], 1937: [2, 10], 1938: [1, 31], 1939: [2, 19],
    1940: [2, 7], 1941: [1, 27], 1942: [2, 15], 1943: [2, 4], 1944: [1, 25],
    1945: [2, 12], 1946: [2, 1], 1947: [1, 22], 1948: [2, 9], 1949: [1, 28],
    1950: [2, 16], 1951: [2, 5], 1952: [1, 26], 1953: [2, 13], 1954: [2, 3],
    1955: [1, 23], 1956: [2, 11], 1957: [1, 30], 1958: [2, 18], 1959: [2, 7],
    1960: [1, 27], 1961: [2, 15], 1962: [2, 4], 1963: [1, 25], 1964: [2, 13],
    1965: [2, 1], 1966: [1, 21], 1967: [2, 9], 1968: [1, 29], 1969: [2, 16],
    1970: [2, 5], 1971: [1, 26], 1972: [2, 14], 1973: [2, 3], 1974: [1, 23],
    1975: [2, 10], 1976: [1, 30], 1977: [2, 17], 1978: [2, 7], 1979: [1, 27],
    1980: [2, 16], 1981: [2, 4], 1982: [1, 24], 1983: [2, 12], 1984: [2, 1],
    1985: [1, 20], 1986: [2, 8], 1987: [1, 29], 1988: [2, 17], 1989: [2, 5],
    1990: [1, 26], 1991: [2, 14], 1992: [2, 3], 1993: [1, 22], 1994: [2, 10],
    1995: [1, 30], 1996: [2, 18], 1997: [2, 7], 1998: [1, 27], 1999: [2, 15],
    2000: [2, 5], 2001: [1, 24], 2002: [2, 11], 2003: [2, 1], 2004: [1, 21],
    2005: [2, 8], 2006: [1, 29], 2007: [2, 17], 2008: [2, 6], 2009: [1, 25],
    2010: [2, 13], 2011: [2, 2], 2012: [1, 22], 2013: [2, 9], 2014: [1, 30],
    2015: [2, 18], 2016: [2, 8], 2017: [1, 27], 2018: [2, 15], 2019: [2, 4],
    2020: [1, 24], 2021: [2, 11], 2022: [1, 31], 2023: [1, 21], 2024: [2, 9],
    2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
};

const zodiacAnimals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];

function isBeforeChineseNewYear(month, day, year) {
    const cnyDate = chineseNewYearDates[year];
    if (!cnyDate) {
        console.warn('Chinese New Year date not found for year', year);
        return false;
    }

    return month < cnyDate[0] || (month === cnyDate[0] && day < cnyDate[1]);
}

const determineZodiacAnimalAndElement = (birthdate) => {
    const dateParts = birthdate.split('-').map(Number);
    if (dateParts.length !== 3) {
        console.error("Invalid date format. Expected YYYY-MM-DD.");
        return null;
    }

    const [year, month, day] = dateParts;
    const isBeforeCNY = isBeforeChineseNewYear(month, day, year);
    const adjustedYear = isBeforeCNY ? year - 1 : year;

    const animalIndex = (adjustedYear - 4) % 12;
    const zodiacAnimal = zodiacAnimals[animalIndex];

    const elementIndex = Math.floor((adjustedYear - 4) % 10 / 2);
    const zodiacElement = elements[elementIndex];

    return { animal: zodiacAnimal, element: zodiacElement };
};

export { determineZodiacAnimalAndElement };