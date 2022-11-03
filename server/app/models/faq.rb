class Faq < ApplicationRecord

    validates :question, presence: true, length: { minimum: 10 }, allow_blank: false
    validates :answer, presence: true, length: { minimum: 2 }, allow_blank: false

end
