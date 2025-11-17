class SimpleCRC {
    // Computes XOR of two binary strings (up to the length of the shorter one).
    static String xor(String a, String b) {
        StringBuilder result = new StringBuilder();
        int len = Math.min(a.length(), b.length());
        for (int i = 0; i < len; i++) {
            result.append(a.charAt(i) == b.charAt(i) ? '0' : '1');
        }
        return result.toString();
    }

    // Performs binary division (modulo-2) and returns the remainder.
    static String divide(String dividend, String divisor) {
        int dLen = divisor.length();
        int subLen = dLen; // length of the substring being divided
        String currentDividend = dividend;

        while (currentDividend.length() >= dLen) {
            if (currentDividend.charAt(0) == '1') {
                // If the first bit is '1', perform XOR with the divisor
                String temp = xor(divisor, currentDividend.substring(0, dLen));
                // New dividend is (temp XOR divisor) excluding its first bit ('0') + rest of the original dividend
                currentDividend = temp.substring(1) + currentDividend.substring(dLen);
            } else {
                // If the first bit is '0', subtract (XOR) '00...0' which is no change.
                // We just slide the window by one bit.
                // New dividend is the slice excluding the first '0' + rest of the original dividend
                currentDividend = currentDividend.substring(1);
            }
        }
        return currentDividend;
    }

    // Generates the CRC Code Word: message + remainder.
    static String generateCodeWord(String message, String generator) {
        int gtrLength = generator.length();
        int paddingLength = gtrLength - 1;
        
        // Append '0's to the message (msgLength + gtrLength - 1)
        String paddedMessage = message + "0".repeat(paddingLength);
        
        String remainder = divide(paddedMessage, generator);
        
        // Ensure remainder is exactly paddingLength long (left-pad with '0's if shorter)
        // This is necessary if the division logic doesn't preserve the exact remainder length (like in the original)
        // For simplicity and matching the original's *output* logic, we just use the result of divide,
        // but typically a CRC remainder must be fixed-width (gtrLength - 1).
        // Let's explicitly pad to ensure the remainder has the correct length before appending.
        String formattedRemainder = String.format("%" + paddingLength + "s", remainder).replace(' ', '0');
        
        return message + formattedRemainder;
    }

    // Checks if the Code Word is valid (remainder is all zeros).
    static boolean checkCodeWord(String codeword, String generator) {
        String remainder = divide(codeword, generator);
        
        // The codeword is valid if the remainder is all '0's.
        // The division process *always* terminates when the dividend length is less than the divisor length.
        // We just need to check if the remainder contains any '1'.
        return !remainder.contains("1");
    }

    // Example usage in main
    public static void main(String[] args) {
        String generator = "1011"; // A common CRC-3 polynomial $x^3 + x + 1$
        String message = "100100";

        // 1. Generate Code Word
        String codeWord = generateCodeWord(message, generator);
        System.out.println("Generator: " + generator);
        System.out.println("Message:   " + message);
        System.out.println("Code Word: " + codeWord);

        // 2. Check Code Word (Valid scenario)
        boolean isValid = checkCodeWord(codeWord, generator);
        System.out.println("\nChecking Generated Code Word (" + codeWord + "): " + (isValid ? "**Valid**" : "Invalid"));
        
        // 3. Check Code Word (Invalid scenario - simulation of error)
        String errorCodeword = "1101001"; // Intentional error
        boolean isErrorValid = checkCodeWord(errorCodeword, generator);
        System.out.println("Checking Error Code Word (" + errorCodeword + "): " + (isErrorValid ? "Valid" : "**Invalid**"));
    }
}