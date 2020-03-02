FROM azul/zulu-openjdk:11
COPY . .
RUN chmod +x wait-for-it.sh
RUN ./gradlew
CMD ["./gradlew","bootRun"]