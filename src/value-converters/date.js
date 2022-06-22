export class dateValueConverter {
  toView (timeStamp) {
    return new Date(timeStamp)
      .toLocaleDateString("en-GB", {day: '2-digit', month: 'long', year: 'numeric'});
  }
}
