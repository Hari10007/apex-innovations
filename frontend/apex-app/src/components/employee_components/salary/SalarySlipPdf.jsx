import React from "react";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";


const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",

  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  }
});

function SalarySlipPdf({}) {

//   const pageColors = ['#f6d186', '#f67280', '#c06c84'];

  return (
    <Document>
        <Page size="A4" style={styles.body}>
            <Text style={styles.title}>APEX INNOVATIONS</Text>
            <Text style={styles.header}>PAYSLIP</Text>
            <Text style={styles.body}>Details</Text>
        </Page>
    </Document>
  );
};

export default SalarySlipPdf;